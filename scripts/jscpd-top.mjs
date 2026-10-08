import { readFileSync, statSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const REPORT = resolve(ROOT, "reports/jscpd/jscpd-report.json");

const DEFAULT_TOP = 30;
const FRAGMENT_WIDTH = 200;
const PLACES_SHOWN = 6;
const MIN_SIGNAL_WORDS = 3;
const MIN_PLACES = 3;
const MIN_WORD_LENGTH = 3;

const IMPORT_RE = /\bimport\b[\s\S]*?from\s*["'][^"']*["']\s*;?/g;
const REEXPORT_RE = /\}\s*from\s*["'][^"']*["']\s*;?/g;
const WORD_RE = /[A-Za-z_$][A-Za-z0-9_$]*/g;

const NOISE_WORDS = new Set([
  "afterEach",
  "as",
  "async",
  "await",
  "beforeEach",
  "boolean",
  "const",
  "default",
  "describe",
  "expect",
  "export",
  "false",
  "fn",
  "from",
  "if",
  "import",
  "it",
  "let",
  "mock",
  "mocked",
  "new",
  "not",
  "null",
  "number",
  "rejects",
  "resolves",
  "return",
  "string",
  "test",
  "this",
  "toBe",
  "toBeNull",
  "toBeUndefined",
  "toEqual",
  "toHaveBeenCalled",
  "toHaveBeenCalledTimes",
  "toHaveBeenCalledWith",
  "toHaveLength",
  "toStrictEqual",
  "true",
  "type",
  "undefined",
  "vi",
  "void",
]);

const args = process.argv.slice(2);

const flagValue = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
};

const showAll = args.includes("--all");
const showPairs = args.includes("--pairs");
const showFull = args.includes("--full");
const grep = flagValue("--grep")?.toLowerCase() ?? null;
const top = Number(flagValue("--top") ?? DEFAULT_TOP);

if (statSync(REPORT, { throwIfNoEntry: false }) === undefined) {
  console.log(`No report at ${relative(ROOT, REPORT)}. Run: pnpm dup`);
  process.exit(0);
}

const report = JSON.parse(readFileSync(REPORT, "utf8"));

const normalize = (fragment) => fragment.replace(/\s+/g, " ").trim();

const signalWords = (fragment) => {
  const withoutImports = fragment
    .replace(IMPORT_RE, " ")
    .replace(REEXPORT_RE, " ");

  return new Set(
    (withoutImports.match(WORD_RE) ?? []).filter(
      (word) => word.length >= MIN_WORD_LENGTH && !NOISE_WORDS.has(word),
    ),
  );
};

const shortPath = (name) =>
  isAbsolute(name) ? relative(ROOT, name) : name.replace(/^\.\//, "");

const groups = new Map();

for (const duplicate of report.duplicates) {
  const fragment = normalize(duplicate.fragment ?? "");
  if (fragment === "") continue;

  const group = groups.get(fragment) ?? {
    fragment,
    lines: duplicate.lines,
    places: new Map(),
  };

  for (const file of [duplicate.firstFile, duplicate.secondFile]) {
    const place = `${shortPath(file.name)}:${file.start}`;
    group.places.set(place, file.start);
  }

  groups.set(fragment, group);
}

const scored = [...groups.values()].map((group) => ({
  ...group,
  places: [...group.places.keys()].sort(),
  signal: signalWords(group.fragment).size,
}));

const noisy = scored.filter((group) => group.signal < MIN_SIGNAL_WORDS);

const matches = (group) =>
  grep === null ||
  group.fragment.toLowerCase().includes(grep) ||
  group.places.some((place) => place.toLowerCase().includes(grep));

const findings = scored
  .filter((group) => group.signal >= MIN_SIGNAL_WORDS)
  .filter((group) => showPairs || group.places.length >= MIN_PLACES)
  .filter(matches)
  .sort(
    (a, b) =>
      b.places.length - a.places.length ||
      b.lines - a.lines ||
      a.fragment.localeCompare(b.fragment),
  );

const shown = showAll ? findings : findings.slice(0, top);

const clip = (fragment) =>
  showFull || fragment.length <= FRAGMENT_WIDTH
    ? fragment
    : `${fragment.slice(0, FRAGMENT_WIDTH)}…`;

const twoPlaceCount = scored.filter(
  (group) =>
    group.signal >= MIN_SIGNAL_WORDS && group.places.length < MIN_PLACES,
).length;

const grepNote = grep === null ? "" : ` matching "${grep}"`;
const pairsNote = showPairs
  ? ""
  : `, ${twoPlaceCount} seen twice only (--pairs)`;

console.log(
  `${report.duplicates.length} clone pairs → ${findings.length} fragments` +
    `${grepNote}, ${noisy.length} dropped as scaffolding${pairsNote}.\n`,
);

for (const group of shown) {
  console.log(`×${group.places.length}  ${group.lines} lines`);
  console.log(`  ${clip(group.fragment)}`);
  console.log(`  ${group.places.slice(0, PLACES_SHOWN).join(", ")}`);
  if (group.places.length > PLACES_SHOWN) {
    console.log(`  …and ${group.places.length - PLACES_SHOWN} more`);
  }
  console.log("");
}

if (shown.length < findings.length) {
  console.log(`Showing ${shown.length} of ${findings.length}. Use --all.`);
}
