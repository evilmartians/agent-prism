import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const OXLINT = fileURLToPath(
  new URL("../node_modules/.bin/oxlint", import.meta.url),
);

const EXPECTED = [
  {
    code: "boundaries(dependencies)",
    file: "packages/data/lint-fixtures/boundaries-violation.ts",
    lines: [1, 2],
  },
  {
    code: "typescript(no-unsafe-member-access)",
    file: "packages/data/lint-fixtures/type-aware-violation.ts",
    lines: [3],
  },
  {
    code: "typescript(no-floating-promises)",
    file: "packages/data/lint-fixtures/type-aware-violation.ts",
    lines: [7],
  },
];

const files = [...new Set(EXPECTED.map(({ file }) => file))];

const { stdout } = spawnSync(
  OXLINT,
  ["--type-aware", "--format", "json", ...files],
  { encoding: "utf8" },
);

const { diagnostics } = JSON.parse(stdout);

const failures = EXPECTED.flatMap(({ code, file, lines }) => {
  const reportedLines = diagnostics
    .filter(
      (diagnostic) => diagnostic.code === code && diagnostic.filename === file,
    )
    .map((diagnostic) => diagnostic.labels[0].span.line);
  const missingLines = lines.filter((line) => !reportedLines.includes(line));

  return missingLines.length > 0
    ? [`${code} did not report ${file} lines ${missingLines.join(", ")}`]
    : [];
});

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
