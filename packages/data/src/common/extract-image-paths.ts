import type {
  TraceSpan,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
];

export function isImageSource(str: string): boolean {
  if (!str || typeof str !== "string") return false;

  const trimmed = str.trim();

  if (trimmed.startsWith("data:image/")) return true;

  const lowerStr = trimmed.toLowerCase();

  return IMAGE_EXTENSIONS.some((ext) => lowerStr.endsWith(ext));
}

interface ImageContentBlock {
  type: "image";
  source: {
    type?: string;
    media_type?: string;
    data: string;
  };
}

function isImageContentBlock(obj: unknown): obj is ImageContentBlock {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    (obj as { type: unknown }).type === "image" &&
    "source" in obj &&
    typeof (obj as { source: unknown }).source === "object" &&
    (obj as { source: { data: unknown } }).source !== null &&
    "data" in (obj as { source: object }).source
  );
}

function extractImagesFromContentBlocks(content: unknown): string[] {
  const images: string[] = [];

  if (Array.isArray(content)) {
    for (const block of content) {
      if (isImageContentBlock(block)) {
        const mediaType = block.source.media_type || "image/png";
        const dataUrl = `data:${mediaType};base64,${block.source.data}`;

        images.push(dataUrl);
      }

      if (typeof block === "object" && block !== null && "content" in block) {
        images.push(
          ...extractImagesFromContentBlocks(
            (block as { content: unknown }).content,
          ),
        );
      }
    }
  }

  return images;
}

export function extractImagePaths(content: string): string[] {
  if (!content || typeof content !== "string") return [];

  const images: string[] = [];

  try {
    const parsed: unknown = JSON.parse(content);

    images.push(...extractImagesFromContentBlocks(parsed));

    if (typeof parsed === "object" && parsed !== null && "content" in parsed) {
      images.push(
        ...extractImagesFromContentBlocks(
          (parsed as { content: unknown }).content,
        ),
      );
    }
  } catch {
    const startPattern = '[{"type":"image"';
    let startIdx = content.indexOf(startPattern);

    while (startIdx !== -1) {
      let bracketCount = 0;
      let endIdx = startIdx;

      for (let i = startIdx; i < content.length; i++) {
        if (content[i] === "[") bracketCount++;
        else if (content[i] === "]") {
          bracketCount--;

          if (bracketCount === 0) {
            endIdx = i + 1;
            break;
          }
        }
      }

      if (endIdx > startIdx) {
        try {
          const jsonStr = content.slice(startIdx, endIdx);
          const parsed: unknown = JSON.parse(jsonStr);

          images.push(...extractImagesFromContentBlocks(parsed));
        } catch {
          // not valid JSON, skip this match
        }
      }

      startIdx = content.indexOf(startPattern, startIdx + 1);
    }
  }

  const pathRegex =
    /(?:^|[\s"'`])([/\w\-._]+\.(?:png|jpg|jpeg|gif|webp|svg|bmp))(?:[\s"'`]|$)/gi;

  for (const match of content.matchAll(pathRegex)) {
    if (match[1]) {
      images.push(match[1]);
    }
  }

  const base64Regex = /(data:image\/[^;]+;base64,[a-zA-Z0-9+/]+=*)/g;

  for (const match of content.matchAll(base64Regex)) {
    if (match[1]) {
      images.push(match[1]);
    }
  }

  return [...new Set(images)];
}

/**
 * Image data-URLs carried on the `claude_code.images` span attribute (a JSON array
 * of `data:<mime>;base64,...` strings emitted by the Claude Code transcoder). This is
 * the typed-image-field path — distinct from `extractImagePaths`, which scrapes images
 * out of the free-text input/output. Returns [] when the attribute is absent or malformed.
 */
export function extractAttributeImages(
  attributes: readonly TraceSpanAttribute[] | undefined,
): string[] {
  if (!attributes) return [];

  const raw = attributes.find((attr) => attr.key === "claude_code.images")
    ?.value?.stringValue;

  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter((url): url is string => typeof url === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * Whether a span exposes any images — scraped from its input/output free text or
 * carried on the `claude_code.images` attribute. Mirrors the extraction done by
 * `DetailsViewImagesTab`, so the Images tab is shown only when it would have content.
 */
export function spanHasImages(span: TraceSpan): boolean {
  if (span.input && extractImagePaths(String(span.input)).length > 0) {
    return true;
  }

  if (extractAttributeImages(span.attributes).length > 0) {
    return true;
  }

  return (
    Boolean(span.output) && extractImagePaths(String(span.output)).length > 0
  );
}
