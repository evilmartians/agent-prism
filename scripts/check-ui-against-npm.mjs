import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGES = {
  "@evilmartians/agent-prism-data": "data",
  "@evilmartians/agent-prism-types": "types",
};

const TSC = createRequire(import.meta.url).resolve("typescript/bin/tsc");
const UI_TSCONFIG = fileURLToPath(
  new URL("../packages/ui/tsconfig.app.json", import.meta.url),
);

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });

  if (result.status !== 0 && options.check !== false) {
    console.error(result.stdout, result.stderr);
    process.exit(result.status ?? 1);
  }

  return result;
};

const dir = mkdtempSync(join(tmpdir(), "ui-against-npm-"));

try {
  const paths = Object.fromEntries(
    Object.entries(PACKAGES).map(([name, folder]) => {
      const target = join(dir, folder);
      run("mkdir", ["-p", target]);
      const { stdout } = run("npm", [
        "pack",
        `${name}@latest`,
        "--pack-destination",
        target,
        "--json",
      ]);
      const [{ filename, version }] = JSON.parse(stdout);
      run("tar", ["xzf", join(target, filename), "-C", target]);
      console.log(`${name}@${version} from npm`);

      return [name, [join(target, "package/dist/index.d.ts")]];
    }),
  );

  const tsconfig = join(dir, "tsconfig.json");
  writeFileSync(
    tsconfig,
    JSON.stringify({
      compilerOptions: { incremental: false, paths, tsBuildInfoFile: null },
      extends: UI_TSCONFIG,
    }),
  );

  const result = run(process.execPath, [TSC, "-p", tsconfig, "--noEmit"], {
    check: false,
  });

  if (result.status !== 0) {
    console.error(
      `${result.stdout}\npackages/ui uses data or types that are not published to npm yet. ` +
        "Release types and data first (AGENTS.md, Publishing), then use the new API in ui.",
    );
    process.exitCode = 1;
  }
} finally {
  rmSync(dir, { force: true, recursive: true });
}
