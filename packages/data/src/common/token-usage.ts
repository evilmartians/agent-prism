import type {
  TokenType,
  TokenUsage,
  TokenUsageEntry,
} from "@evilmartians/agent-prism-types";

export type TokenUsageRow = Required<TokenUsageEntry> & { type: TokenType };

/**
 * Render order. Types outside this list keep the order they were added in and
 * go before `total`, which always comes last.
 */
const TYPE_ORDER: TokenType[] = [
  "input",
  "output",
  "cache_read",
  "cache_write",
];

const orderOf = (type: TokenType): number => {
  if (type === "total") {
    return Number.POSITIVE_INFINITY;
  }

  const index = TYPE_ORDER.indexOf(type);

  return index === -1 ? TYPE_ORDER.length : index;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const toFiniteNumber = (value: unknown): number =>
  isFiniteNumber(value) ? value : 0;

/**
 * Drops binary floating-point noise from summed costs, so 0.003 + 0.0015 reads
 * as 0.0045 rather than 0.0045000000000000005.
 */
const roundCost = (cost: number): number => Number(cost.toPrecision(12));

/** Every recorded token type, in render order, with the cost defaulted to 0. */
export const getTokenUsageEntries = (
  usage: TokenUsage | undefined,
): TokenUsageRow[] =>
  Object.entries(usage ?? {})
    .flatMap(([type, entry]) =>
      entry
        ? [
            {
              type,
              tokens: toFiniteNumber(entry.tokens),
              cost: toFiniteNumber(entry.cost),
            },
          ]
        : [],
    )
    .sort((a, b) => orderOf(a.type) - orderOf(b.type));

export const getTotalTokens = (usage: TokenUsage | undefined): number =>
  getTokenUsageEntries(usage).reduce((total, row) => total + row.tokens, 0);

/** 0 when no cost was reported; use hasReportedCost to tell that from free. */
export const getTotalCost = (usage: TokenUsage | undefined): number =>
  roundCost(
    getTokenUsageEntries(usage).reduce((total, row) => total + row.cost, 0),
  );

/** Whether the source reported a cost for any token type (0 included). */
export const hasReportedCost = (usage: TokenUsage | undefined): boolean =>
  Object.values(usage ?? {}).some((entry) => isFiniteNumber(entry?.cost));

/**
 * Returns `usage` with tokens (and optionally their cost) added under a type,
 * summing into an entry that is already there. A non-finite token count counts
 * as 0. A cost is recorded only when one is reported (0 included), so an
 * unknown cost never reads as a free call.
 */
export const addTokenUsage = (
  usage: TokenUsage,
  type: TokenType,
  tokens: number,
  cost?: number,
): TokenUsage => {
  const existing = usage[type];
  const entry: TokenUsageEntry = {
    tokens: toFiniteNumber(existing?.tokens) + toFiniteNumber(tokens),
  };

  if (isFiniteNumber(cost) || isFiniteNumber(existing?.cost)) {
    entry.cost = roundCost(
      toFiniteNumber(existing?.cost) + toFiniteNumber(cost),
    );
  }

  return { ...usage, [type]: entry };
};

/**
 * Squares the typed entries with a total the source reported alongside (or
 * instead of) them: whatever part of it they don't cover is recorded under
 * `total`. A total below what the entries already add up to is ignored — some
 * sources leave cache tokens out of it.
 */
export const addReportedTotal = (
  usage: TokenUsage,
  tokens?: number,
  cost?: number,
): TokenUsage => {
  let result = usage;

  if (isFiniteNumber(tokens)) {
    const covered = getTotalTokens(result);

    if (covered === 0 || tokens > covered) {
      result = addTokenUsage(result, "total", tokens - covered);
    }
  }

  if (isFiniteNumber(cost)) {
    const covered = getTotalCost(result);

    if (covered === 0 || roundCost(cost) > covered) {
      result = addTokenUsage(result, "total", 0, roundCost(cost) - covered);
    }
  }

  return result;
};
