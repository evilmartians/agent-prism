import { describe, expect, it } from "vitest";

import {
  addReportedTotal,
  addTokenUsage,
  getTokenUsageEntries,
  getTotalCost,
  getTotalTokens,
} from "./token-usage";

describe("token usage", () => {
  describe("totals", () => {
    it("sum every type", () => {
      const usage = {
        input: { tokens: 100, cost: 0.003 },
        output: { tokens: 50, cost: 0.0015 },
        cache_read: { tokens: 1000, cost: 0.0003 },
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
          input: { tokens: 0, cost: 0.1 },
          output: { tokens: 0, cost: 0.2 },
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
        total: { tokens: 5 },
        input_audio: { tokens: 7 },
        cache_write: { tokens: 1 },
        output: { tokens: 2 },
        input: { tokens: 3, cost: 0.01 },
      };

      expect(getTokenUsageEntries(usage)).toEqual([
        { type: "input", tokens: 3, cost: 0.01 },
        { type: "output", tokens: 2, cost: 0 },
        { type: "cache_write", tokens: 1, cost: 0 },
        { type: "input_audio", tokens: 7, cost: 0 },
        { type: "total", tokens: 5, cost: 0 },
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

      expect(usage).toEqual({ input: { tokens: 150, cost: 0.003 } });
    });

    it("does not modify the usage it was given", () => {
      const usage = { input: { tokens: 100, cost: 0 } };

      addTokenUsage(usage, "input", 1);

      expect(usage).toEqual({ input: { tokens: 100, cost: 0 } });
    });

    it.each([Number.NaN, Number.POSITIVE_INFINITY])(
      "counts %s as zero",
      (value) => {
        expect(addTokenUsage({}, "input", value, value)).toEqual({
          input: { tokens: 0, cost: 0 },
        });
      },
    );
  });

  describe("addReportedTotal", () => {
    it("records the whole total when nothing is typed", () => {
      expect(addReportedTotal({}, 500, 0.01)).toEqual({
        total: { tokens: 500, cost: 0.01 },
      });
    });

    it("records only the part the typed entries don't cover", () => {
      const usage = addReportedTotal(
        { input: { tokens: 100, cost: 0.001 } },
        160,
        0.004,
      );

      expect(usage.total).toEqual({ tokens: 60, cost: 0.003 });
      expect(getTotalTokens(usage)).toBe(160);
      expect(getTotalCost(usage)).toBe(0.004);
    });

    it("ignores a total below what the entries add up to", () => {
      const usage = addReportedTotal(
        { input: { tokens: 100, cost: 0.005 } },
        80,
        0.001,
      );

      expect(usage.total).toBeUndefined();
    });

    it("records a reported zero", () => {
      expect(addReportedTotal({}, 0)).toEqual({
        total: { tokens: 0, cost: 0 },
      });
    });

    it("ignores missing or non-finite totals", () => {
      expect(addReportedTotal({}, undefined, undefined)).toEqual({});
      expect(
        addReportedTotal({}, Number.NaN, Number.POSITIVE_INFINITY),
      ).toEqual({});
    });
  });
});
