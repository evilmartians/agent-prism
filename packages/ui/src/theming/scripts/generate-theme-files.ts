import { generateCssContent } from "./generate-css-content";
import { generateTsContent } from "./generate-ts-content";
import { saveContentToFile } from "./save-to-file";

const cssContent = generateCssContent();
const tsContent = generateTsContent();

saveContentToFile(cssContent, "theme.css");
saveContentToFile(tsContent, "index.ts");
