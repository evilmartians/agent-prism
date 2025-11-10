// @ts-expect-error - Node.js built-in modules
import { writeFileSync } from "node:fs";
// @ts-expect-error - Node.js built-in modules
import { join, dirname } from "node:path";
// @ts-expect-error - Node.js built-in modules
import { fileURLToPath } from "node:url";

export function saveContentToFile(content: string, fileName: string) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const outputPath = join(currentDir, `../../components/theme/${fileName}`);

  writeFileSync(outputPath, content, "utf-8");
  console.log(`✅ Generated ${fileName} at ${outputPath}`);
}
