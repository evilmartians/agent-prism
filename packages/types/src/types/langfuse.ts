export type LangfuseDocument = {
  trace: LangfuseTrace;
  observations: LangfuseObservation[];
};

export type LangfuseTrace = {
  id: string;
  projectId: string;
  name: string;
  timestamp: string; // ISO date string
  environment: string;
  tags: string[];
  bookmarked: boolean;
  release: string | null;
  version: string | null;
  userId?: string | null;
  sessionId?: string | null;
  public: boolean;
  input?: string | null;
  output?: string | null;
  metadata?: string | Record<string, unknown> | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  scores: LangfuseScore[];
  latency?: number; // milliseconds
  observations?: LangfuseObservation[];
};

export type LangfuseScoreSource = "ANNOTATION" | "API" | "EVAL" | "USER";

export type LangfuseScoreDataType = "CATEGORICAL" | "NUMERIC" | "BOOLEAN";

export type LangfuseScore = {
  id: string;
  timestamp: string;
  projectId: string;
  name: string;
  value: number | null;
  source: LangfuseScoreSource;
  authorUserId: string | null;
  comment: string | null;
  traceId: string;
  observationId: string | null;
  configId: string | null;
  stringValue: string | null;
  queueId: string | null;
  createdAt: string;
  updatedAt: string;
  dataType: LangfuseScoreDataType;
};

export type LangfuseObservationType =
  | "EVENT"
  | "SPAN"
  | "GENERATION"
  | "AGENT"
  | "TOOL"
  | "CHAIN"
  | "RETRIEVER"
  | "EVALUATOR"
  | "EMBEDDING"
  | "GUARDRAIL"
  | "UNKNOWN";

export type LangfuseObservationLevel =
  | "DEBUG"
  | "DEFAULT"
  | "WARNING"
  | "ERROR";

export type LangfuseObservation = {
  id: string;
  traceId: string;
  projectId: string;
  environment: string;
  parentObservationId: string | null;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  name: string;
  metadata?: unknown | null;
  type?: LangfuseObservationType;
  level?: LangfuseObservationLevel;
  input?: string | null;
  output?: string | null;
  statusMessage?: string | null;
  version?: string | null;
  promptId?: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  latency?: number; // milliseconds
  timeToFirstToken?: number | null; // seconds
  model?: string | null;
  internalModelId?: string | null;
  promptName?: string | null;
  promptVersion?: number | null;
  usageDetails?: LangfuseUsageDetails;
  costDetails?: LangfuseCostDetails;
  providedCostDetails?: Record<string, unknown>;
};

export type LangfuseUsageDetails = {
  input?: number;
  output?: number;
  total?: number;
  input_cached_tokens?: number;
  output_reasoning_tokens?: number;
};

export type LangfuseCostDetails = {
  input?: number;
  output?: number;
  total?: number;
  input_cached_tokens?: number;
  output_reasoning_tokens?: number;
};
