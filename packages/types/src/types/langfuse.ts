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

export type LangfuseScore = {
  id: string;
  timestamp: string; // ISO date string
  projectId: string;
  environment: string;
  name: string;
  source: string;
  authorUserId: string | null;
  comment?: string | null;
  metadata?: string | Record<string, unknown> | null;
  configId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  queueId: string | null;
  traceId: string;
  observationId: string | null;
  sessionId: string | null;
  datasetRunId: string | null;
  value?: number | null;
  stringValue?: string | null;
  dataType?: "NUMERIC" | "STRING" | string;
};

export type LangfuseObservation =
  | LangfuseGenerationObservation
  | LangfuseSpanObservation
  | LangfuseToolObservation;

export type LangfuseObservationCommon = {
  id: string;
  traceId: string;
  projectId: string;
  environment: string;
  parentObservationId: string | null;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  name: string;
  metadata?: string | Record<string, unknown> | null;
  level?: string; // e.g. "DEFAULT"
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

export type LangfuseGenerationObservation = LangfuseObservationCommon & {
  type: "GENERATION";
  modelParameters?: Record<string, unknown> | null;
  completionStartTime?: string | null; // ISO date string
  inputCost?: number | null;
  outputCost?: number | null;
  totalCost?: number | null;
  inputUsage?: number | null;
  outputUsage?: number | null;
  totalUsage?: number | null;
};

export type LangfuseSpanObservation = LangfuseObservationCommon & {
  type: "SPAN";
};

export type LangfuseToolObservation = LangfuseObservationCommon & {
  type: "TOOL";
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


