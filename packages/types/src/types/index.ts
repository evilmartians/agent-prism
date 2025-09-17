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

export type TraceSpan = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: TraceSpanCategory;
  raw: string;
  attributes?: TraceSpanAttribute[];
  children?: TraceSpan[];
  status: TraceSpanStatus;
  cost?: number;
  tokensCount?: number;
  input?: string;
  output?: string;
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

export type InputOutputData = {
  input?: string;
  output?: string;
};

export type TraceSpanAttribute = {
  key: string;
  value: TraceSpanAttributeValue;
};

export type TraceSpanAttributeValue = {
  stringValue?: string;
  intValue?: string;
  boolValue?: boolean;
};
