import { describe, expect, it } from "vitest";

import { flattenSpans } from "./flatten-spans.js";
import { createTestSpan } from "./test-utils/create-test-span.js";

describe("flattenSpans", () => {
  it("should return an empty array when input is an empty array", () => {
    expect(flattenSpans([])).toStrictEqual([]);
  });

  it("should return the same array if there are no children", () => {
    const input = [createTestSpan({ id: "1" })];
    expect(flattenSpans(input)).toStrictEqual(input);
  });

  it("should flatten spans with one level of children", () => {
    const child = createTestSpan({ id: "2" });
    const parent = createTestSpan({ children: [child], id: "1" });
    expect(flattenSpans([parent])).toStrictEqual([parent, child]);
  });

  it("should flatten spans with multiple levels of children", () => {
    const grandchild = createTestSpan({ id: "3" });
    const child = createTestSpan({ children: [grandchild], id: "2" });
    const parent = createTestSpan({ children: [child], id: "1" });
    expect(flattenSpans([parent])).toStrictEqual([parent, child, grandchild]);
  });

  it("should handle spans where some children arrays are empty or undefined", () => {
    const input = [
      createTestSpan({ children: [], id: "1" }),
      createTestSpan({ children: undefined, id: "2" }),
    ];
    expect(flattenSpans(input)).toStrictEqual(input);
  });

  it("should handle nested spans with mixed empty and non-empty children", () => {
    const grandchild = createTestSpan({ id: "3" });
    const child = createTestSpan({ children: [], id: "2" });
    const parent = createTestSpan({ children: [child, grandchild], id: "1" });
    expect(flattenSpans([parent])).toStrictEqual([parent, child, grandchild]);
  });
});
