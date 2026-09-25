import { describe, expect, it } from "vitest";

import { getShortModelName } from "./get-short-model-name";

describe("getShortModelName", () => {
  it("parses current Opus versions including ones the old ladder did not know", () => {
    // The bug: claude-opus-4-8 / 4-7 used to fall through to a generic "Opus 4".
    expect(getShortModelName("claude-opus-4-8")).toBe("Opus 4.8");
    expect(getShortModelName("claude-opus-4-8[1m]")).toBe("Opus 4.8");
    expect(getShortModelName("claude-opus-4-7")).toBe("Opus 4.7");
  });

  it("still parses the versions the old ladder handled (no regression)", () => {
    expect(getShortModelName("claude-opus-4-6")).toBe("Opus 4.6");
    expect(getShortModelName("claude-opus-4-5")).toBe("Opus 4.5");
    expect(getShortModelName("claude-sonnet-4-6")).toBe("Sonnet 4.6");
    expect(getShortModelName("claude-haiku-4-5")).toBe("Haiku 4.5");
  });

  it("handles dotted versions and a trailing date/tag suffix", () => {
    expect(getShortModelName("claude-opus-4.8")).toBe("Opus 4.8");
    expect(getShortModelName("claude-haiku-4-5-20251001")).toBe("Haiku 4.5");
  });

  it("handles the legacy version-before-family id order", () => {
    expect(getShortModelName("claude-3-5-sonnet-20241022")).toBe("Sonnet 3.5");
    expect(getShortModelName("claude-3-opus-20240229")).toBe("Opus 3");
    expect(getShortModelName("claude-4-opus")).toBe("Opus 4");
  });

  it("is future-proof for unseen versions", () => {
    expect(getShortModelName("claude-opus-4-9")).toBe("Opus 4.9");
    expect(getShortModelName("claude-opus-5-2")).toBe("Opus 5.2");
  });

  it("does not swallow a date suffix as the minor version (real released ids)", () => {
    // claude-{opus,sonnet}-4-20250514 are real ids: major-only version + date.
    expect(getShortModelName("claude-opus-4-20250514")).toBe("Opus 4");
    expect(getShortModelName("claude-sonnet-4-20250514")).toBe("Sonnet 4");
    // A bare date with no version → family only, not "Opus 20240229".
    expect(getShortModelName("claude-opus-20240229")).toBe("Opus");
    // A date BEFORE the family must not have its tail read as a version
    // ("...14-opus" → "Opus 14"); the version needs a clean leading boundary.
    expect(getShortModelName("claude-20250514-opus")).toBe("Opus");
  });

  it("does not fuse a version onto the family without a separator", () => {
    expect(getShortModelName("claude-opus48")).toBe("Opus");
  });

  it("does not crash on a non-string model", () => {
    expect(() => getShortModelName(null)).not.toThrow();
    expect(() => getShortModelName(undefined)).not.toThrow();
  });

  it("falls back to the family name when no version is present", () => {
    expect(getShortModelName("claude-opus")).toBe("Opus");
    expect(getShortModelName("some-opus-model")).toBe("Opus");
  });

  it("leaves non-Claude models unchanged", () => {
    expect(getShortModelName("gpt-4o")).toBe("GPT-4o");
    expect(getShortModelName("gpt-4-turbo")).toBe("GPT-4");
    expect(getShortModelName("gemini-2-flash")).toBe("Gemini 2");
    expect(getShortModelName("gemini-1.5-pro")).toBe("Gemini 1.5");
  });

  it("parses GPT and Gemini minor versions, not just the major", () => {
    expect(getShortModelName("gemini-2.5-pro")).toBe("Gemini 2.5");
    expect(getShortModelName("gemini-2.0-flash")).toBe("Gemini 2.0");
    expect(getShortModelName("gpt-4.1-mini")).toBe("GPT-4.1");
    expect(getShortModelName("gpt-3.5-turbo")).toBe("GPT-3.5");
    expect(getShortModelName("gpt-5")).toBe("GPT-5");
  });
});
