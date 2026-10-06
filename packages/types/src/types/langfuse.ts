export type LangfuseCostDetails = {
  input?: number;
  input_cached_tokens?: number;
  output?: number;
  output_reasoning_tokens?: number;
  total?: number;
};

export type LangfuseDocument = {
  observations: LangfuseObservation[];
  trace: LangfuseTrace;
};

export type LangfuseObservation = {
  costDetails?: LangfuseCostDetails | null;
  /** ISO date string. */
  createdAt: string;
  /** ISO date string; null while the observation runs. */
  endTime: null | string;
  environment: string;
  id: string;
  input?: null | string;
  inputCost?: null | number;
  /** Aggregate Langfuse derives from usageDetails. */
  inputUsage?: null | number;
  internalModelId?: null | string;
  /** Milliseconds. */
  latency?: number;
  level?: LangfuseObservationLevel;
  metadata?: null | unknown;
  model?: null | string;
  name: string;
  output?: null | string;
  outputCost?: null | number;
  outputUsage?: null | number;
  parentObservationId: null | string;
  projectId: string;
  promptId?: null | string;
  promptName?: null | string;
  promptVersion?: null | number;
  providedCostDetails?: Record<string, unknown>;
  /** ISO date string. */
  startTime: string;
  statusMessage?: null | string;
  /** Seconds. */
  timeToFirstToken?: null | number;
  totalCost?: null | number;
  totalUsage?: null | number;
  traceId: string;
  type?: LangfuseObservationType;
  /** ISO date string. */
  updatedAt: string;
  usageDetails?: LangfuseUsageDetails | null;
  version?: null | string;
};

export type LangfuseObservationLevel =
  | "DEBUG"
  | "DEFAULT"
  | "ERROR"
  | "WARNING";

export type LangfuseObservationType =
  | "AGENT"
  | "CHAIN"
  | "EMBEDDING"
  | "EVALUATOR"
  | "EVENT"
  | "GENERATION"
  | "GUARDRAIL"
  | "RETRIEVER"
  | "SPAN"
  | "TOOL"
  | "UNKNOWN";

export type LangfuseScore = {
  authorUserId: null | string;
  comment: null | string;
  configId: null | string;
  createdAt: string;
  dataType: LangfuseScoreDataType;
  id: string;
  name: string;
  observationId: null | string;
  projectId: string;
  queueId: null | string;
  source: LangfuseScoreSource;
  stringValue: null | string;
  timestamp: string;
  traceId: string;
  updatedAt: string;
  value: null | number;
};

export type LangfuseScoreDataType = "BOOLEAN" | "CATEGORICAL" | "NUMERIC";

export type LangfuseScoreSource = "ANNOTATION" | "API" | "EVAL" | "USER";

export type LangfuseTrace = {
  bookmarked: boolean;
  /** ISO date string. */
  createdAt: string;
  environment: string;
  id: string;
  input?: null | string;
  /** Milliseconds. */
  latency?: number;
  metadata?: null | Record<string, unknown> | string;
  name: string;
  observations?: LangfuseObservation[];
  output?: null | string;
  projectId: string;
  public: boolean;
  release: null | string;
  scores: LangfuseScore[];
  sessionId?: null | string;
  tags: string[];
  /** ISO date string. */
  timestamp: string;
  /** ISO date string. */
  updatedAt: string;
  userId?: null | string;
  version: null | string;
};

export type LangfuseUsageDetails = {
  input?: number;
  input_cached_tokens?: number;
  output?: number;
  output_reasoning_tokens?: number;
  total?: number;
};
