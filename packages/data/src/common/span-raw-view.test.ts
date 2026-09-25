import { describe, expect, it } from "vitest";

import { resolveSpanRaw, selectSliceForSpan } from "./span-raw-view";

describe("resolveSpanRaw", () => {
  it("renders the vendor slice as a single pretty-JSON record when present", () => {
    const out = resolveSpanRaw({ spanId: "abc", name: "target" }, [
      '{"normalized":true}',
      '{"normalized":"end"}',
    ]);

    expect(out).toHaveLength(1);
    expect(out[0]).toMatch(/"name": "target"/);
    expect(out[0]).not.toMatch(/normalized/);
  });

  it("falls back to the span's raw records when there is no vendor slice", () => {
    const records = ['{"normalized":true}', '{"normalized":"end"}'];

    expect(resolveSpanRaw(null, records)).toBe(records);
  });

  it("pretty-prints a nested vendor slice", () => {
    const [out] = resolveSpanRaw(
      { attributes: [{ key: "gen_ai.system", value: { stringValue: "openai" } }] },
      ["fallback"],
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
