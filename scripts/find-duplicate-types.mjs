import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";

const ROOT = resolve(import.meta.dirname, "..");
const API_DIR = "packages/types/src/";

const MIN_MEMBERS = 2;
const MIN_API_MEMBERS = 2;
const DEFAULT_TOP = 40;
const PLACES_SHOWN = 8;

const args = process.argv.slice(2);

const flagValue = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? null : args[index + 1];
};

const showAll = args.includes("--all");
const namedOnly = args.includes("--named-only");
const grep = flagValue("--grep")?.toLowerCase() ?? null;
const top = Number(flagValue("--top") ?? DEFAULT_TOP);

const files = globSync("packages/*/src/**/*.{ts,tsx}", { cwd: ROOT })
  .map((file) => (typeof file === "string" ? file : file.toString()))
  .filter((file) => !file.endsWith(".d.ts"))
  .sort();

const normalizeType = (text) =>
  text
    .replace(/\s+/g, " ")
    .trim()
    .split("|")
    .map((part) => part.trim())
    .sort()
    .join(" | ");

const readMembers = (members, source) => {
  const keys = [];

  for (const member of members) {
    if (!ts.isPropertySignature(member) || member.name === undefined)
      return null;

    const name = member.name.getText(source);
    const optional = member.questionToken === undefined ? "" : "?";
    const type =
      member.type === undefined
        ? "unknown"
        : normalizeType(member.type.getText(source));

    keys.push(`${name}${optional}: ${type}`);
  }

  return keys.sort();
};

const describeInline = (node, source) => {
  let current = node.parent;

  while (current !== undefined) {
    if (
      (ts.isTypeAliasDeclaration(current) ||
        ts.isInterfaceDeclaration(current) ||
        ts.isFunctionDeclaration(current) ||
        ts.isVariableDeclaration(current) ||
        ts.isPropertySignature(current) ||
        ts.isPropertyDeclaration(current) ||
        ts.isParameter(current) ||
        ts.isMethodSignature(current)) &&
      current.name !== undefined &&
      ts.isIdentifier(current.name)
    ) {
      return `in ${current.name.getText(source)}`;
    }

    current = current.parent;
  }

  return "inline";
};

const declarations = [];

for (const file of files) {
  const source = ts.createSourceFile(
    file,
    readFileSync(resolve(ROOT, file), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const record = (node, members, label, isNamed) => {
    declarations.push({
      file,
      isNamed,
      label,
      line:
        source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
      members,
    });
  };

  const visit = (node) => {
    const generic =
      node.typeParameters !== undefined && node.typeParameters.length > 0;

    if (
      ts.isInterfaceDeclaration(node) &&
      !generic &&
      (node.heritageClauses ?? []).length === 0
    ) {
      const members = readMembers(node.members, source);
      if (members !== null)
        record(node, members, node.name.getText(source), true);
    }

    if (ts.isTypeLiteralNode(node)) {
      const named =
        ts.isTypeAliasDeclaration(node.parent) &&
        (node.parent.typeParameters ?? []).length === 0;
      const members = readMembers(node.members, source);

      if (members !== null && !(namedOnly && !named)) {
        record(
          node,
          members,
          named
            ? node.parent.name.getText(source)
            : describeInline(node, source),
          named,
        );
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(source);
}

const shaped = declarations.filter(
  (entry) => entry.members.length >= MIN_MEMBERS,
);

const groups = new Map();

for (const entry of shaped) {
  const key = entry.members.join("; ");
  groups.set(key, [...(groups.get(key) ?? []), entry]);
}

const matches = (text) => grep === null || text.toLowerCase().includes(grep);

const outsideApi = (entry) => !entry.file.startsWith(API_DIR);

const identical = [...groups.entries()]
  .filter(([, entries]) => entries.filter(outsideApi).length > 1)
  .map(([key, entries]) => ({ entries, key }))
  .filter(
    ({ entries, key }) =>
      matches(key) ||
      entries.some((entry) => matches(`${entry.file} ${entry.label}`)),
  )
  .sort(
    (a, b) => b.entries.length - a.entries.length || a.key.localeCompare(b.key),
  );

const apiTypes = shaped.filter(
  (entry) =>
    entry.file.startsWith(API_DIR) &&
    entry.isNamed &&
    entry.members.length >= MIN_API_MEMBERS,
);

const localNamed = shaped.filter((entry) => outsideApi(entry) && entry.isNamed);

const nameOf = (memberKey) => memberKey.split(":")[0].replace("?", "");

const supersets = [];

for (const local of localNamed) {
  const own = new Set(local.members);

  for (const apiType of apiTypes) {
    if (apiType.members.length > local.members.length) continue;
    if (!apiType.members.every((member) => own.has(member))) continue;

    supersets.push({
      apiType,
      extra: local.members
        .filter((m) => !apiType.members.includes(m))
        .map(nameOf),
      local,
    });
  }
}

const visibleSupersets = supersets
  .filter(
    ({ apiType, local }) =>
      matches(`${local.file} ${local.label}`) || matches(apiType.label),
  )
  .sort(
    (a, b) =>
      a.extra.length - b.extra.length ||
      a.local.file.localeCompare(b.local.file) ||
      a.local.line - b.local.line,
  );

const clip = (list) => (showAll ? list : list.slice(0, top));

const suffix = grep === null ? "" : ` matching "${grep}"`;

console.log(
  `${shaped.length} object shapes read from ${files.length} files` +
    `${namedOnly ? " (named only)" : ""}.\n` +
    `Structurally identical: ${identical.length} groups${suffix}. ` +
    `Repeating a type from ${API_DIR}: ${visibleSupersets.length}${suffix}.\n`,
);

if (identical.length > 0) {
  console.log("Structurally identical shapes:\n");
  process.exitCode = 1;

  for (const { entries, key } of clip(identical)) {
    console.log(`  { ${key} }`);

    for (const entry of entries.slice(0, PLACES_SHOWN)) {
      console.log(`    ${entry.file}:${entry.line}  ${entry.label}`);
    }

    if (entries.length > PLACES_SHOWN) {
      console.log(`    …and ${entries.length - PLACES_SHOWN} more`);
    }

    console.log("");
  }
}

if (visibleSupersets.length > 0) {
  console.log(`Named types that spell out a type from ${API_DIR}:\n`);
  process.exitCode = 1;

  for (const { apiType, extra, local } of clip(visibleSupersets)) {
    const plus = extra.length === 0 ? "" : ` + ${extra.join(", ")}`;
    console.log(`  ${local.file}:${local.line}  ${local.label}`);
    console.log(
      `    = ${apiType.label} (${apiType.members.map(nameOf).join(", ")})${plus}`,
    );
    console.log("");
  }
}

if (identical.length === 0 && visibleSupersets.length === 0) {
  console.log("Nothing found.");
}
