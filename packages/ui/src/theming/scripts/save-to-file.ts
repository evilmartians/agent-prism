import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function saveContentToFile(content: string, fileName: string): void {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const outputPath = join(currentDir, `../../components/theme/${fileName}`);

  writeFileSync(outputPath, content, "utf-8");
  console.log(`✅ Generated ${fileName} at ${outputPath}`);
}
