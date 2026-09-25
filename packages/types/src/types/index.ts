export type TraceRecord = {
  id: string;
  name: string;
  spansCount: number;
  durationMs: number;
  agentDescription: string;
  totalCost?: number;
  totalTokens?: number;
  startTime?: number;
};

export type TraceSpanStatus = "success" | "error" | "pending" | "warning";

export type InputOutputData = {
  input?: string;
  output?: string;
};

export type TraceSpan<TMetadata = Record<string, unknown>> = InputOutputData & {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: TraceSpanCategory;
  /** The source records this span was built from, each as JSON text. */
  raw: string[];
  attributes?: TraceSpanAttribute[];
  children?: TraceSpan<TMetadata>[];
  status: TraceSpanStatus;
  /** Absent when the source reported no usage at all. */
  tokenUsage?: TokenUsage;
  reasoning?: TraceReasoning;
  todos?: TraceTodo[];
  metadata?: TMetadata;
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
  | "input"
  | "output"
  | "cache_read"
  | "cache_write"
  | "total"
  | (string & {});

export type TokenUsageEntry = {
  tokens: number;
  cost?: number;
};

/**
 * Tokens a span spent, and what they cost, per token type. Entries must not
 * overlap: totals are plain sums, so a token counted under two types is counted
 * twice. Adapters therefore record either the granular types or a single
 * `total`, and reasoning tokens stay inside `output` (they are reported on
 * `TraceSpan.reasoning` instead).
 */
export type TokenUsage = {
  input?: TokenUsageEntry;
  output?: TokenUsageEntry;
  cache_read?: TokenUsageEntry;
  cache_write?: TokenUsageEntry;
  total?: TokenUsageEntry;
  [type: string]: TokenUsageEntry | undefined;
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
  /**
   * Tokens spent on thinking, when the source reports them. They are already
   * part of `tokenUsage.output`, so never add them to it again.
   */
  tokens?: number;
  level?: TraceReasoningLevel;
  /** What made the model think harder, e.g. a "think hard" keyword. */
  triggers?: string[];
};

export type TraceReasoningLevel = "high" | "medium" | "low";

export type TraceTodoStatus = "pending" | "in_progress" | "completed";

/** One entry of the agent's task list, as shown in the Todos section. */
export type TraceTodo = {
  title: string;
  status: TraceTodoStatus;
};

export type TraceSpanCategory =
  | "llm_call"
  | "tool_execution"
  | "agent_invocation"
  | "chain_operation"
  | "retrieval"
  | "embedding"
  | "create_agent"
  | "span"
  | "event"
  | "guardrail"
  | "unknown";

export type TraceSpanAttribute = {
  key: string;
  value: TraceSpanAttributeValue;
};

export type TraceSpanAttributeValue = {
  stringValue?: string;
  intValue?: string;
  boolValue?: boolean;
};
