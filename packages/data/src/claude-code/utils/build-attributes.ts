import type {
  ClaudeCodeUsage,
  TraceSpanAttribute,
} from "@evilmartians/agent-prism-types";

import {
  CLAUDE_CODE_ATTRIBUTES,
  OPENTELEMETRY_GENAI_ATTRIBUTES,
} from "@evilmartians/agent-prism-types";

import { isRecord } from "./guards.js";

const GENAI = OPENTELEMETRY_GENAI_ATTRIBUTES;
const CLAUDE = CLAUDE_CODE_ATTRIBUTES;

const GENAI_USAGE_PREFIX = "gen_ai.usage.";

const MAX_TEXT_LENGTH = 1000;

const NO_KEYS: ReadonlySet<string> = new Set();

const isEmpty = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0) ||
  (isRecord(value) && Object.keys(value).length === 0);

const tokensOf = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

/**
 * Wraps a value as a span attribute; undefined when there is nothing to record.
 * Only integers travel as `intValue`, which is read back with parseInt. Lists
 * and objects are kept as JSON, and long text is cut: the whole record stays
 * in the span's raw.
 */
export const toAttribute = (
  key: string,
  value: unknown,
): TraceSpanAttribute | undefined => {
  if (isEmpty(value)) return undefined;
  if (typeof value === "boolean") return { key, value: { boolValue: value } };

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return undefined;

    return Number.isInteger(value)
      ? { key, value: { intValue: String(value) } }
      : { key, value: { stringValue: String(value) } };
  }

  const text =
    typeof value === "string"
      ? value
      : (JSON.stringify(value) ?? String(value));

  return {
    key,
    value: {
      stringValue:
        text.length > MAX_TEXT_LENGTH
          ? `${text.slice(0, MAX_TEXT_LENGTH)}…`
          : text,
    },
  };
};

export const compactAttributes = (
  attributes: (TraceSpanAttribute | undefined)[],
): TraceSpanAttribute[] =>
  attributes.filter(
    (attribute): attribute is TraceSpanAttribute => attribute !== undefined,
  );

/**
 * The fields of a transcript record as `<prefix><field>` attributes, without
 * the ones in `handled`. One level of nesting is flattened (`origin.kind`).
 */
export const passthroughAttributes = (
  record: unknown,
  prefix: string,
  handled: ReadonlySet<string> = NO_KEYS,
): TraceSpanAttribute[] => {
  if (!isRecord(record)) return [];

  return Object.entries(record).flatMap(([key, value]) => {
    if (handled.has(key)) return [];

    const name = `${prefix}${key}`;

    return compactAttributes(
      isRecord(value)
        ? Object.entries(value).map(([nestedKey, nested]) =>
            toAttribute(`${name}.${nestedKey}`, nested),
          )
        : [toAttribute(name, value)],
    );
  });
};

/**
 * `target` plus the attributes of `incoming` it does not have yet. When
 * several records merge into one span, the first value of a key is the one
 * that stays.
 */
export const addMissingAttributes = (
  target: TraceSpanAttribute[] = [],
  incoming: TraceSpanAttribute[] = [],
): TraceSpanAttribute[] => {
  const keys = new Set(target.map((attribute) => attribute.key));
  const result = [...target];

  incoming.forEach((attribute) => {
    if (!keys.has(attribute.key)) {
      keys.add(attribute.key);
      result.push(attribute);
    }
  });

  return result;
};

/**
 * Whether an attribute restates a response's usage. Every record of a response
 * repeats the usage, so these follow its latest record rather than its first.
 */
export const isUsageAttribute = (key: string): boolean =>
  key.startsWith(GENAI_USAGE_PREFIX) ||
  key.startsWith(CLAUDE.USAGE_PREFIX) ||
  key === CLAUDE.CUMULATIVE_TOKENS ||
  key === CLAUDE.CACHE_HIT_RATIO;

/**
 * The attributes a response's usage gives rise to: the GenAI token counts, the
 * context figures the Context tab reads, and the usage as Claude Code reports
 * it under `claude_code.usage.*`.
 *
 * Anthropic counts cached prompt tokens next to `input_tokens`, while the GenAI
 * conventions count them inside it, so `gen_ai.usage.input_tokens` is the sum.
 */
export const usageAttributes = (
  usage: ClaudeCodeUsage | undefined,
): TraceSpanAttribute[] => {
  if (!isRecord(usage)) return [];

  const cacheRead = tokensOf(usage.cache_read_input_tokens);
  const cacheWrite = tokensOf(usage.cache_creation_input_tokens);
  const output = tokensOf(usage.output_tokens);
  const prompt =
    (tokensOf(usage.input_tokens) ?? 0) + (cacheRead ?? 0) + (cacheWrite ?? 0);
  const reported = passthroughAttributes(usage, CLAUDE.USAGE_PREFIX);

  // The records Claude Code writes itself report zeros across the board.
  if (prompt + (output ?? 0) === 0) return reported;

  return [
    ...compactAttributes([
      toAttribute(GENAI.USAGE_INPUT_TOKENS, prompt),
      toAttribute(GENAI.USAGE_OUTPUT_TOKENS, output),
      toAttribute(GENAI.USAGE_CACHE_READ_INPUT_TOKENS, cacheRead),
      toAttribute(GENAI.USAGE_CACHE_CREATION_INPUT_TOKENS, cacheWrite),
      toAttribute(
        GENAI.USAGE_REASONING_OUTPUT_TOKENS,
        usage.output_tokens_details?.thinking_tokens,
      ),
      toAttribute(CLAUDE.CUMULATIVE_TOKENS, prompt),
      prompt > 0
        ? toAttribute(
            CLAUDE.CACHE_HIT_RATIO,
            ((cacheRead ?? 0) / prompt).toFixed(4),
          )
        : undefined,
    ]),
    ...reported,
  ];
};
