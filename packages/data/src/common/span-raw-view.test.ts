import { describe, expect, it } from "vitest";

import { resolveSpanRaw, selectSliceForSpan } from "./span-raw-view";

describe("resolveSpanRaw", () => {
  it("renders the vendor slice as pretty JSON when present", () => {
    const out = resolveSpanRaw(
      { spanId: "abc", name: "target" },
      '{"normalized":true}',
    );

    expect(out).toMatch(/"name": "target"/);
    expect(out).not.toMatch(/normalized/);
  });

  it("falls back to the normalized raw string when there is no vendor slice", () => {
    const normalized = '{"normalized":true}';

    expect(resolveSpanRaw(null, normalized)).toBe(normalized);
  });

  it("pretty-prints a nested vendor slice", () => {
    const out = resolveSpanRaw(
      { attributes: [{ key: "gen_ai.system", value: { stringValue: "openai" } }] },
      "fallback",
    );

    expect(out).toMatch(/"gen_ai.system"/);
    expect(out).toMatch(/\n {2}"attributes"/);
  });
});

describe("selectSliceForSpan", () => {
  it("returns the slice when it was resolved for the current span", () => {
    expect(selectSliceForSpan({ spanId: "a", slice: { x: 1 } }, "a")).toEqual({
      x: 1,
    });
  });

  it("returns null when the resolved slice belongs to a different span", () => {
    expect(selectSliceForSpan({ spanId: "a", slice: { x: 1 } }, "b")).toBeNull();
  });

  it("returns null when nothing has resolved yet", () => {
    expect(selectSliceForSpan(null, "a")).toBeNull();
  });

  it("passes a null slice through (no vendor slice resolved for this span)", () => {
    expect(selectSliceForSpan({ spanId: "a", slice: null }, "a")).toBeNull();
  });
});
