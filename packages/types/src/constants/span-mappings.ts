import type { TraceSpanCategory } from "../types/index.js";

export const OPENTELEMETRY_GENAI_ATTRIBUTES = {
  AGENT_NAME: "gen_ai.agent.name",
  MODEL: "gen_ai.request.model",
  OPERATION_NAME: "gen_ai.operation.name",
  REQUEST_PROMPT: "gen_ai.request.prompt",
  REQUEST_TEMPERATURE: "gen_ai.request.temperature",
  RESPONSE_TEXT: "gen_ai.response.text",
  SYSTEM: "gen_ai.system",
  TOOL_NAME: "gen_ai.tool.name",
  /** Part of input_tokens, per the GenAI semantic conventions. */
  USAGE_CACHE_CREATION_INPUT_TOKENS: "gen_ai.usage.cache_creation.input_tokens",
  /** Part of input_tokens, per the GenAI semantic conventions. */
  USAGE_CACHE_READ_INPUT_TOKENS: "gen_ai.usage.cache_read.input_tokens",
  USAGE_COST: "gen_ai.usage.cost",
  USAGE_INPUT_COST: "gen_ai.usage.input_cost",
  USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens",
  USAGE_OUTPUT_COST: "gen_ai.usage.output_cost",
  USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens",
  /** Part of output_tokens, per the GenAI semantic conventions. */
  USAGE_REASONING_OUTPUT_TOKENS: "gen_ai.usage.reasoning.output_tokens",
  USAGE_TOTAL_TOKENS: "gen_ai.usage.total_tokens",
} as const;

export const OPENINFERENCE_ATTRIBUTES = {
  EMBEDDING_MODEL: "embedding.model_name",
  INPUT_MESSAGES: "llm.input_messages",
  LLM_MODEL: "llm.model_name",
  RETRIEVAL_DOCUMENTS: "retrieval.documents",
  SPAN_KIND: "openinference.span.kind",
} as const;

export const STANDARD_OPENTELEMETRY_ATTRIBUTES = {
  DB_COLLECTION: "db.collection.name",
  DB_OPERATION: "db.operation.name",
  DB_QUERY_TEXT: "db.query.text",
  DB_SYSTEM: "db.system",
  FUNCTION_NAME: "function.name",
  HTTP_METHOD: "http.method",
  HTTP_URL: "http.url",
} as const;

/** Maps an OpenTelemetry GenAI `gen_ai.operation.name` to a span category. */
export const OPENTELEMETRY_GENAI_MAPPINGS: Record<string, TraceSpanCategory> = {
  chat: "llm_call",
  create_agent: "create_agent",
  embeddings: "embedding",
  execute_tool: "tool_execution",
  generate_content: "llm_call",
  invoke_agent: "agent_invocation",
  text_completion: "llm_call",
} as const;

/** Maps an OpenInference `openinference.span.kind` to a span category. */
export const OPENINFERENCE_MAPPINGS: Record<string, TraceSpanCategory> = {
  AGENT: "agent_invocation",
  CHAIN: "chain_operation",
  EMBEDDING: "embedding",
  LLM: "llm_call",
  RETRIEVER: "retrieval",
  TOOL: "tool_execution",
} as const;

/** Span-name keywords that categorize plain OpenTelemetry spans. */
export const STANDARD_OPENTELEMETRY_PATTERNS = {
  AGENT_KEYWORDS: ["agent"],
  CHAIN_KEYWORDS: ["chain", "workflow", "langchain"],
  DATABASE_KEYWORDS: [],
  FUNCTION_KEYWORDS: ["tool", "function"],
  HTTP_KEYWORDS: [],
  LLM_KEYWORDS: ["openai", "anthropic", "gpt", "claude"],
  RETRIEVAL_KEYWORDS: ["pinecone", "chroma", "retrieval", "vector", "search"],
} as const;

export const INPUT_OUTPUT_ATTRIBUTES = {
  INPUT_VALUE: "input.value",
  OUTPUT_VALUE: "output.value",
} as const;
