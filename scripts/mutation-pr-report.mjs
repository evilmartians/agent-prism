import { execFileSync } from "node:child_process";
import fs from "node:fs";

const MARKER = "<!-- mutation-report -->";
const SURVIVING = new Set(["NoCoverage", "Survived"]);
const MAX_PER_FILE = 12;

const PACKAGE_DIR = "packages/data";

const [baseRef = "origin/main"] = process.argv.slice(2);
const reportPath = `${PACKAGE_DIR}/reports/mutation/mutation.json`;

const changedLines = (file) => {
  const diff = execFileSync(
    "/usr/bin/git",
    ["diff", "--unified=0", `${baseRef}...HEAD`, "--", file],
    { cwd: PACKAGE_DIR, encoding: "utf8" },
  );
  const lines = new Set();

  for (const hunk of diff.matchAll(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(hunk[1]);
    const count = hunk[2] === undefined ? 1 : Number(hunk[2]);

    for (let line = start; line < start + count; line++) lines.add(line);
  }

  return lines;
};

const truncateMiddle = (text, max) => {
  const flat = text.replaceAll(/\s+/g, " ").trim();

  if (flat.length <= max) return flat;

  const head = Math.ceil((max - 1) / 2);
  const tail = Math.floor((max - 1) / 2);

  return `${flat.slice(0, head)}…${flat.slice(-tail)}`;
};

const originalSnippet = (mutant, sourceLines) => {
  const { end, start } = mutant.location;

  return sourceLines.slice(start.line - 1, end.line).join(" ");
};

const describe = (mutant, sourceLines) => {
  const { end, start } = mutant.location;
  const lines =
    end.line > start.line ? `L${start.line}-${end.line}` : `L${start.line}`;
  const original = truncateMiddle(originalSnippet(mutant, sourceLines), 90);
  const replacement =
    truncateMiddle(mutant.replacement ?? "", 60) || "(removed)";
  const label = mutant.status === "NoCoverage" ? " *(no test runs it)*" : "";

  return `- **${lines}** \`${mutant.mutatorName}\`${label}\n  \`${original}\` → \`${replacement}\``;
};

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const sections = [];
let insideDiff = 0;
let elsewhere = 0;

for (const [file, data] of Object.entries(report.files)) {
  const survivors = data.mutants.filter((m) => SURVIVING.has(m.status));

  if (survivors.length === 0) continue;

  const sourceLines = (data.source ?? "").split("\n");
  const touched = changedLines(file);
  const inDiff = survivors.filter((m) => touched.has(m.location.start.line));
  const rest = survivors.filter((m) => !touched.has(m.location.start.line));

  insideDiff += inDiff.length;
  elsewhere += rest.length;

  const body = [`**\`${PACKAGE_DIR}/${file}\`**`];

  if (inDiff.length > 0) {
    body.push(
      inDiff
        .slice(0, MAX_PER_FILE)
        .map((m) => describe(m, sourceLines))
        .join("\n"),
    );

    if (inDiff.length > MAX_PER_FILE) {
      body.push(
        `_…and ${inDiff.length - MAX_PER_FILE} more on changed lines._`,
      );
    }
  }

  if (rest.length > 0) {
    const shown = rest
      .slice(0, MAX_PER_FILE)
      .map((m) => describe(m, sourceLines))
      .join("\n");
    const more =
      rest.length > MAX_PER_FILE
        ? `\n\n_…and ${rest.length - MAX_PER_FILE} more._`
        : "";

    body.push(
      `<details><summary>Show ${rest.length}</summary>\n\n${shown}${more}\n\n</details>`,
    );
  }

  sections.push(body.join("\n\n"));
}

const lines = [MARKER, "### Mutation testing"];

if (sections.length === 0) {
  lines.push(
    "Every mutant in the data files you touched was killed — the tests notice each of those lines breaking.",
  );
} else {
  const headline =
    insideDiff > 0
      ? `**${insideDiff} surviving ${insideDiff === 1 ? "mutant" : "mutants"} on lines you changed.**`
      : "**No survivors on the lines you changed.**";
  const tail =
    elsewhere > 0
      ? ` ${elsewhere} more ${elsewhere === 1 ? "survives" : "survive"} elsewhere in the same files (folded below).`
      : "";

  lines.push(
    `${headline}${tail}`,
    "",
    "Each entry is a change to your code that no test would catch. Some are equivalent mutants — a rewrite that cannot alter behaviour — and those are fine to ignore. Nothing here blocks the merge.",
    "",
    sections.join("\n\n"),
  );
}

process.stdout.write(`${lines.join("\n")}\n`);
