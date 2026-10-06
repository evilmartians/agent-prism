import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const OXLINT = fileURLToPath(
  new URL("../node_modules/.bin/oxlint", import.meta.url),
);
const FIXTURE = "packages/data/lint-fixtures/boundaries-violation.ts";
const EXPECTED_LINES = [1, 2];

const { stdout } = spawnSync(OXLINT, ["--format", "json", FIXTURE], {
  encoding: "utf8",
});

const reportedLines = JSON.parse(stdout)
  .diagnostics.filter(
    (diagnostic) => diagnostic.code === "boundaries(dependencies)",
  )
  .map((diagnostic) => diagnostic.labels[0].span.line);

const missingLines = EXPECTED_LINES.filter(
  (line) => !reportedLines.includes(line),
);

if (missingLines.length > 0) {
  console.error(
    `boundaries/dependencies did not report ${FIXTURE} lines ${missingLines.join(", ")}`,
  );
  process.exit(1);
}
