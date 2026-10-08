/**
 * `T` with every property and array made readonly, all the way down, for
 * parameters that only read a value. Dates, functions and classes are kept as
 * they are. A mutable value is assignable to its `DeepReadonly` version.
 */
export type DeepReadonly<T> = unknown extends T
  ? T
  : T extends
        | ((...args: never) => unknown)
        | (abstract new (...args: never) => unknown)
        | bigint
        | boolean
        | Date
        | null
        | number
        | string
        | symbol
        | undefined
    ? T
    : { readonly [Key in keyof T]: DeepReadonly<T[Key]> };

export type InputOutputData = {
  input?: string | undefined;
  output?: string | undefined;
};

/**
 * Kinds of tokens a span can spend. Adapters map vendor-specific names onto
 * these so every source renders the same way; a type outside this list (say,
 * Langfuse's `input_audio`) is kept under its source name.
 *
 * - `input`: prompt tokens not served from or written to a cache
 * - `output`: completion tokens, reasoning tokens included
 * - `cache_read`: prompt tokens served from the provider's cache
 * - `cache_write`: prompt tokens written to the provider's cache
 * - `total`: an aggregate the source did not break down by type
 */
export type TokenType =
  | "cache_read"
  | "cache_write"
  | "input"
  | "output"
  | "total"
  | (string & {});

/**
 * Tokens a span spent, and what they cost, per token type. Entries must not
 * overlap: totals are plain sums, so a token counted under two types is counted
 * twice. Adapters therefore record either the granular types or a single
 * `total`, and reasoning tokens stay inside `output` (they are reported on
 * `TraceSpan.reasoning` instead).
 */
export type TokenUsage = {
  [type: string]: TokenUsageEntry | undefined;
  cache_read?: TokenUsageEntry;
  cache_write?: TokenUsageEntry;
  input?: TokenUsageEntry;
  output?: TokenUsageEntry;
  total?: TokenUsageEntry;
};

export type TokenUsageEntry = {
  cost?: number;
  tokens: number;
};

/**
 * The model's extended thinking for a span, as shown on the Thinking tab.
 */
export type TraceReasoning = {
  /**
   * The thinking text. Empty when the provider reports reasoning tokens but
   * withholds the text itself (e.g. OpenAI reasoning models).
   */
  content: string;
  level?: TraceReasoningLevel | undefined;
  /**
   * Tokens spent on thinking, when the source reports them. They are already
   * part of `tokenUsage.output`, so never add them to it again.
   */
  tokens?: number | undefined;
  /** What made the model think harder, e.g. a "think hard" keyword. */
  triggers?: string[] | undefined;
};

export type TraceReasoningLevel = "high" | "low" | "medium";

export type TraceRecord = {
  agentDescription: string;
  durationMs: number;
  id: string;
  name: string;
  spansCount: number;
  startTime?: number;
  totalCost?: number;
  totalTokens?: number;
};

export type TraceSpan<TMetadata = Record<string, unknown>> = InputOutputData & {
  attributes?: TraceSpanAttribute[];
  children?: TraceSpan<TMetadata>[] | undefined;
  endTime: Date;
  id: string;
  metadata?: TMetadata;
  /** The source records this span was built from, each as JSON text. */
  raw: string[];
  reasoning?: TraceReasoning | undefined;
  startTime: Date;
  status: TraceSpanStatus;
  title: string;
  todos?: TraceTodo[] | undefined;
  /** Absent when the source reported no usage at all. */
  tokenUsage?: TokenUsage | undefined;
  type: TraceSpanCategory;
};

export type TraceSpanAttribute = {
  key: string;
  value: TraceSpanAttributeValue;
};

/**
 * An OpenTelemetry `AnyValue` in OTLP/JSON form. `intValue` is an int64, which
 * OTLP/JSON writes as a decimal string but parsers also accept as a number.
 */
export type TraceSpanAttributeValue = {
  arrayValue?: { values: TraceSpanAttributeValue[] };
  boolValue?: boolean;
  bytesValue?: string;
  doubleValue?: number;
  intValue?: number | string;
  kvlistValue?: { values: TraceSpanAttribute[] };
  stringValue?: string;
};

export type TraceSpanCategory =
  | "agent_invocation"
  | "chain_operation"
  | "create_agent"
  | "embedding"
  | "event"
  | "guardrail"
  | "llm_call"
  | "retrieval"
  | "span"
  | "tool_execution"
  | "unknown";

export type TraceSpanStatus = "error" | "pending" | "success" | "warning";

/** One entry of the agent's task list, as shown in the Todos section. */
export type TraceTodo = {
  status: TraceTodoStatus;
  title: string;
};

export type TraceTodoStatus = "completed" | "in_progress" | "pending";
