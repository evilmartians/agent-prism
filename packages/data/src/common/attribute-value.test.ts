import type {
  DeepReadonly,
  TraceSpanAttributeValue,
} from "@evilmartians/agent-prism-types";

import { describe, expect, it } from "vitest";

import {
  getAttributeNumber,
  toAttributeValue,
  toPlainAttributeValue,
} from "./attribute-value.js";

type NumberRow = readonly [
  DeepReadonly<TraceSpanAttributeValue> | undefined,
  number | undefined,
];

describe("getAttributeNumber", () => {
  it.each<NumberRow>([
    [{ doubleValue: 0.7 }, 0.7],
    [{ intValue: 42 }, 42],
    [{ intValue: "42" }, 42],
    [{ stringValue: "1.5" }, 1.5],
    [{ stringValue: "n/a" }, undefined],
    [{ boolValue: true }, undefined],
    [undefined, undefined],
  ])("reads %j as %j", (value, expected) => {
    expect(getAttributeNumber(value)).toBe(expected);
  });
});

describe("toPlainAttributeValue", () => {
  it("unwraps every value form, nested ones included", () => {
    expect(
      toPlainAttributeValue({
        kvlistValue: {
          values: [
            { key: "bytes", value: { bytesValue: "AAE=" } },
            {
              key: "list",
              value: {
                arrayValue: {
                  values: [
                    { intValue: "1" },
                    { doubleValue: 0.5 },
                    { boolValue: false },
                    { stringValue: "a" },
                  ],
                },
              },
            },
          ],
        },
      }),
    ).toStrictEqual({ bytes: "AAE=", list: [1, 0.5, false, "a"] });
  });

  it("returns undefined for an empty value", () => {
    expect(toPlainAttributeValue({})).toBeUndefined();
  });
});

describe("toAttributeValue", () => {
  it("round-trips through toPlainAttributeValue", () => {
    const plain = { list: [1, 0.5, "a", true], nested: { ok: false } };
    const value = toAttributeValue(plain);

    expect(value && toPlainAttributeValue(value)).toStrictEqual(plain);
  });

  it("has no form for null", () => {
    expect(toAttributeValue(null)).toBeUndefined();
  });
});
