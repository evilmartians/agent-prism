import { describe, expect, it } from "vitest";

import {
  addMissingAttributes,
  passthroughAttributes,
  toAttribute,
  usageAttributes,
} from "../utils/build-attributes";

describe("toAttribute", () => {
  it("wraps a value by its type", () => {
    expect(toAttribute("k", "main")).toEqual({
      key: "k",
      value: { stringValue: "main" },
    });
    expect(toAttribute("k", 42)).toEqual({
      key: "k",
      value: { intValue: "42" },
    });
    expect(toAttribute("k", false)).toEqual({
      key: "k",
      value: { boolValue: false },
    });
  });

  it("keeps a fraction as text, since intValue is read back as an integer", () => {
    expect(toAttribute("k", 0.25)).toEqual({
      key: "k",
      value: { stringValue: "0.25" },
    });
  });

  it("keeps lists and objects as JSON", () => {
    expect(toAttribute("k", [{ a: 1 }])).toEqual({
      key: "k",
      value: { stringValue: '[{"a":1}]' },
    });
  });

  it("cuts long text", () => {
    const value = toAttribute("k", "x".repeat(1500))?.value.stringValue;

    expect(value).toHaveLength(1001);
    expect(value?.endsWith("…")).toBe(true);
  });

  it("has nothing to record for an empty value", () => {
    [undefined, null, "", Number.NaN, [], {}].forEach((value) => {
      expect(toAttribute("k", value)).toBeUndefined();
    });
  });
});

describe("passthroughAttributes", () => {
  it("prefixes the fields it is not told to leave out", () => {
    expect(
      passthroughAttributes(
        { uuid: "u1", gitBranch: "main", message: { role: "user" } },
        "claude_code.",
        new Set(["message"]),
      ),
    ).toEqual([
      { key: "claude_code.uuid", value: { stringValue: "u1" } },
      { key: "claude_code.gitBranch", value: { stringValue: "main" } },
    ]);
  });

  it("flattens one level of nesting and keeps what is deeper as JSON", () => {
    expect(
      passthroughAttributes(
        { origin: { kind: "human", detail: { via: "sdk" } }, parentUuid: null },
        "claude_code.",
      ),
    ).toEqual([
      { key: "claude_code.origin.kind", value: { stringValue: "human" } },
      {
        key: "claude_code.origin.detail",
        value: { stringValue: '{"via":"sdk"}' },
      },
    ]);
  });

  it("returns nothing for what is not a record", () => {
    expect(passthroughAttributes("Error: Exit code 1", "p.")).toEqual([]);
    expect(passthroughAttributes(undefined, "p.")).toEqual([]);
  });
});

describe("addMissingAttributes", () => {
  it("keeps the first value of a key", () => {
    expect(
      addMissingAttributes(
        [{ key: "a", value: { stringValue: "first" } }],
        [
          { key: "a", value: { stringValue: "second" } },
          { key: "b", value: { stringValue: "new" } },
          { key: "b", value: { stringValue: "again" } },
        ],
      ),
    ).toEqual([
      { key: "a", value: { stringValue: "first" } },
      { key: "b", value: { stringValue: "new" } },
    ]);
  });
});

describe("usageAttributes", () => {
  const attributes = usageAttributes({
    input_tokens: 2,
    output_tokens: 878,
    cache_read_input_tokens: 48558,
    cache_creation_input_tokens: 3188,
    output_tokens_details: { thinking_tokens: 380 },
    service_tier: "standard",
    speed: "standard",
  });
  const value = (key: string) =>
    attributes.find((attribute) => attribute.key === key)?.value;

  it("counts cached tokens into the GenAI input tokens", () => {
    expect(value("gen_ai.usage.input_tokens")).toEqual({ intValue: "51748" });
    expect(value("gen_ai.usage.output_tokens")).toEqual({ intValue: "878" });
    expect(value("gen_ai.usage.cache_read.input_tokens")).toEqual({
      intValue: "48558",
    });
    expect(value("gen_ai.usage.cache_creation.input_tokens")).toEqual({
      intValue: "3188",
    });
    expect(value("gen_ai.usage.reasoning.output_tokens")).toEqual({
      intValue: "380",
    });
  });

  it("writes the context figures the way the Context tab reads them", () => {
    expect(value("claude_code.cumulative_tokens")).toEqual({
      intValue: "51748",
    });
    expect(value("claude_code.cache_hit_ratio")).toEqual({
      stringValue: "0.9384",
    });
  });

  it("keeps the usage as it was reported", () => {
    expect(value("claude_code.usage.input_tokens")).toEqual({ intValue: "2" });
    expect(value("claude_code.usage.speed")).toEqual({
      stringValue: "standard",
    });
    expect(
      value("claude_code.usage.output_tokens_details.thinking_tokens"),
    ).toEqual({ intValue: "380" });
  });

  it("derives nothing from a usage of zeros", () => {
    expect(
      usageAttributes({ input_tokens: 0, output_tokens: 0 }).map(
        (attribute) => attribute.key,
      ),
    ).toEqual([
      "claude_code.usage.input_tokens",
      "claude_code.usage.output_tokens",
    ]);
    expect(usageAttributes(undefined)).toEqual([]);
  });
});
