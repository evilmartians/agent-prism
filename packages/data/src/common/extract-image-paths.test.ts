import type {
  TraceSpan,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import {
  extractAttributeImages,
  extractImagePaths,
  isImageSource,
  spanHasImages,
} from "./extract-image-paths";

const baseSpan = (overrides: Partial<TraceSpan> = {}): TraceSpan => ({
  id: "span-1",
  title: "Span",
  startTime: new Date("2024-01-01T00:00:00Z"),
  endTime: new Date("2024-01-01T00:00:01Z"),
  duration: 1000,
  type: "llm_call",
  raw: "{}",
  status: "success",
  ...overrides,
});

describe("isImageSource", () => {
  it("recognizes data URIs and image extensions, rejects others", () => {
    expect(isImageSource("data:image/png;base64,AAAA")).toBe(true);
    expect(isImageSource("/tmp/shot.png")).toBe(true);
    expect(isImageSource("/tmp/SHOT.JPEG")).toBe(true); // case-insensitive
    expect(isImageSource("just text")).toBe(false);
    expect(isImageSource("")).toBe(false);
  });
});

describe("extractImagePaths", () => {
  it("builds a base64 data URL from an image content block", () => {
    const content = JSON.stringify([
      { type: "image", source: { media_type: "image/png", data: "AAAA" } },
    ]);

    expect(extractImagePaths(content)).toEqual(["data:image/png;base64,AAAA"]);
  });

  it("defaults the media type to image/png", () => {
    const content = JSON.stringify([
      { type: "image", source: { data: "BBBB" } },
    ]);

    expect(extractImagePaths(content)).toEqual(["data:image/png;base64,BBBB"]);
  });

  it("finds file paths via regex and dedups", () => {
    const out = extractImagePaths("see /a/x.png and /a/x.png and /b/y.jpg");

    expect([...out].sort()).toEqual(["/a/x.png", "/b/y.jpg"]);
  });

  it("returns [] for content with no images", () => {
    expect(extractImagePaths("no images here")).toEqual([]);
    expect(extractImagePaths("")).toEqual([]);
  });
});

describe("extractAttributeImages", () => {
  it("parses the claude_code.images attribute array", () => {
    const attributes: TraceSpanAttribute[] = [
      {
        key: "gen_ai.request.model",
        value: { stringValue: "claude-opus-4-6" },
      },
      {
        key: "claude_code.images",
        value: { stringValue: JSON.stringify(["data:image/png;base64,AAAA"]) },
      },
    ];

    expect(extractAttributeImages(attributes)).toEqual([
      "data:image/png;base64,AAAA",
    ]);
  });

  it("returns [] when the attribute is absent or malformed", () => {
    expect(extractAttributeImages(undefined)).toEqual([]);
    expect(extractAttributeImages([])).toEqual([]);
    expect(
      extractAttributeImages([
        { key: "claude_code.images", value: { stringValue: "not-json" } },
      ]),
    ).toEqual([]);
  });
});

describe("spanHasImages", () => {
  it("is true when the input carries an image path", () => {
    expect(spanHasImages(baseSpan({ input: "see /a/x.png" }))).toBe(true);
  });

  it("is true when the output carries an image path", () => {
    expect(spanHasImages(baseSpan({ output: "result /b/y.jpg" }))).toBe(true);
  });

  it("is true when the claude_code.images attribute is present", () => {
    const span = baseSpan({
      attributes: [
        {
          key: "claude_code.images",
          value: {
            stringValue: JSON.stringify(["data:image/png;base64,AAAA"]),
          },
        },
      ],
    });

    expect(spanHasImages(span)).toBe(true);
  });

  it("is false when the span has no images", () => {
    expect(
      spanHasImages(baseSpan({ input: "plain text", output: "done" })),
    ).toBe(false);
  });
});
