import { describe, expect, it } from "vitest";

import {
  addReportedTotal,
  addTokenUsage,
  getTokenUsageEntries,
  getTotalCost,
  getTotalTokens,
  hasReportedCost,
} from "./token-usage.js";

describe("token usage", () => {
  describe("totals", () => {
    it("sum every type", () => {
      const usage = {
        cache_read: { cost: 0.0003, tokens: 1000 },
        input: { cost: 0.003, tokens: 100 },
        output: { cost: 0.0015, tokens: 50 },
      };

      expect(getTotalTokens(usage)).toBe(1150);
      expect(getTotalCost(usage)).toBe(0.0048);
    });

    it("treat a missing cost as zero", () => {
      expect(getTotalCost({ input: { tokens: 100 } })).toBe(0);
    });

    it("drop floating-point noise from the cost", () => {
      expect(
        getTotalCost({
          input: { cost: 0.1, tokens: 0 },
          output: { cost: 0.2, tokens: 0 },
        }),
      ).toBe(0.3);
    });

    it("are zero when no usage was reported", () => {
      expect(getTotalTokens(undefined)).toBe(0);
      expect(getTotalCost(undefined)).toBe(0);
    });
  });

  describe("getTokenUsageEntries", () => {
    it("lists known types in order, custom ones after, total last", () => {
      const usage = {
        cache_write: { tokens: 1 },
        input: { cost: 0.01, tokens: 3 },
        input_audio: { tokens: 7 },
        output: { tokens: 2 },
        total: { tokens: 5 },
      };

      expect(getTokenUsageEntries(usage)).toStrictEqual([
        { cost: 0.01, tokens: 3, type: "input" },
        { cost: 0, tokens: 2, type: "output" },
        { cost: 0, tokens: 1, type: "cache_write" },
        { cost: 0, tokens: 7, type: "input_audio" },
        { cost: 0, tokens: 5, type: "total" },
      ]);
    });
  });

  describe("addTokenUsage", () => {
    it("sums into a type that is already present", () => {
      const usage = addTokenUsage(
        addTokenUsage({}, "input", 100, 0.001),
        "input",
        50,
        0.002,
      );

      expect(usage).toStrictEqual({ input: { cost: 0.003, tokens: 150 } });
    });

    it("does not modify the usage it was given", () => {
      const usage = { input: { cost: 0, tokens: 100 } };

      addTokenUsage(usage, "input", 1);

      expect(usage).toStrictEqual({ input: { cost: 0, tokens: 100 } });
    });

    it.each([Number.NaN, Number.POSITIVE_INFINITY])(
      "counts %s tokens as zero and ignores it as a cost",
      (value) => {
        expect(addTokenUsage({}, "input", value, value)).toStrictEqual({
          input: { tokens: 0 },
        });
      },
    );

    it("leaves the cost out when none was reported", () => {
      expect(addTokenUsage({}, "input", 100)).toStrictEqual({
        input: { tokens: 100 },
      });
    });

    it("keeps an explicitly reported zero cost", () => {
      expect(addTokenUsage({}, "input", 100, 0)).toStrictEqual({
        input: { cost: 0, tokens: 100 },
      });
    });

    it("keeps an earlier cost when later tokens come without one", () => {
      const usage = addTokenUsage(
        addTokenUsage({}, "input", 100, 0.001),
        "input",
        50,
      );

      expect(usage).toStrictEqual({ input: { cost: 0.001, tokens: 150 } });
    });
  });

  describe("hasReportedCost", () => {
    it("is false when no entry carries a cost", () => {
      expect(hasReportedCost({ input: { tokens: 100 } })).toBe(false);
      expect(hasReportedCost(undefined)).toBe(false);
    });

    it("is true for any reported cost, zero included", () => {
      expect(
        hasReportedCost({
          input: { tokens: 100 },
          output: { cost: 0, tokens: 5 },
        }),
      ).toBe(true);
    });
  });

  describe("addReportedTotal", () => {
    it("records the whole total when nothing is typed", () => {
      expect(addReportedTotal({}, 500, 0.01)).toStrictEqual({
        total: { cost: 0.01, tokens: 500 },
      });
    });

    it("records only the part the typed entries don't cover", () => {
      const usage = addReportedTotal(
        { input: { cost: 0.001, tokens: 100 } },
        160,
        0.004,
      );

      expect(usage.total).toStrictEqual({ cost: 0.003, tokens: 60 });
      expect(getTotalTokens(usage)).toBe(160);
      expect(getTotalCost(usage)).toBe(0.004);
    });

    it("ignores a total below what the entries add up to", () => {
      const usage = addReportedTotal(
        { input: { cost: 0.005, tokens: 100 } },
        80,
        0.001,
      );

      expect(usage.total).toBeUndefined();
    });

    it("records a reported zero", () => {
      expect(addReportedTotal({}, 0)).toStrictEqual({ total: { tokens: 0 } });
      expect(addReportedTotal({}, undefined, 0)).toStrictEqual({
        total: { cost: 0, tokens: 0 },
      });
    });

    it("ignores missing or non-finite totals", () => {
      expect(addReportedTotal({}, undefined, undefined)).toStrictEqual({});
      expect(
        addReportedTotal({}, Number.NaN, Number.POSITIVE_INFINITY),
      ).toStrictEqual({});
    });
  });
});
