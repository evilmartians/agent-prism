import type { TraceSpanCategory } from "../types";

// OpenTelemetry GenAI attribute constants
export const OPENTELEMETRY_GENAI_ATTRIBUTES = {
  OPERATION_NAME: "gen_ai.operation.name",
  SYSTEM: "gen_ai.system",
  MODEL: "gen_ai.request.model",
  AGENT_NAME: "gen_ai.agent.name",
  TOOL_NAME: "gen_ai.tool.name",
  // Usage and cost attributes
  USAGE_INPUT_TOKENS: "gen_ai.usage.input_tokens",
  USAGE_OUTPUT_TOKENS: "gen_ai.usage.output_tokens",
  USAGE_TOTAL_TOKENS: "gen_ai.usage.total_tokens",
  // Part of input_tokens / output_tokens, per the GenAI semantic conventions
  USAGE_CACHE_READ_INPUT_TOKENS: "gen_ai.usage.cache_read.input_tokens",
  USAGE_CACHE_CREATION_INPUT_TOKENS: "gen_ai.usage.cache_creation.input_tokens",
  USAGE_REASONING_OUTPUT_TOKENS: "gen_ai.usage.reasoning.output_tokens",
  USAGE_COST: "gen_ai.usage.cost",
  USAGE_INPUT_COST: "gen_ai.usage.input_cost",
  USAGE_OUTPUT_COST: "gen_ai.usage.output_cost",
  // Request attributes
  REQUEST_TEMPERATURE: "gen_ai.request.temperature",
  REQUEST_PROMPT: "gen_ai.request.prompt",
  // Response attributes
  RESPONSE_TEXT: "gen_ai.response.text",
} as const;

export const OPENINFERENCE_ATTRIBUTES = {
  SPAN_KIND: "openinference.span.kind",
  LLM_MODEL: "llm.model_name",
  INPUT_MESSAGES: "llm.input_messages",
  RETRIEVAL_DOCUMENTS: "retrieval.documents",
  EMBEDDING_MODEL: "embedding.model_name",
} as const;

export const STANDARD_OPENTELEMETRY_ATTRIBUTES = {
  HTTP_METHOD: "http.method",
  HTTP_URL: "http.url",
  DB_SYSTEM: "db.system",
  DB_OPERATION: "db.operation.name",
  DB_COLLECTION: "db.collection.name",
  DB_QUERY_TEXT: "db.query.text",
  FUNCTION_NAME: "function.name",
} as const;

// OpenTelemetry GenAI operation name mappings
export const OPENTELEMETRY_GENAI_MAPPINGS: Record<string, TraceSpanCategory> = {
  // LLM operations
  chat: "llm_call",
  generate_content: "llm_call",
  text_completion: "llm_call",

  // Tool operations
  execute_tool: "tool_execution",

  // Agent operations
  invoke_agent: "agent_invocation",
  create_agent: "create_agent",

  // Embedding operations
  embeddings: "embedding",
} as const;

// OpenInference span kind mappings
export const OPENINFERENCE_MAPPINGS: Record<string, TraceSpanCategory> = {
  LLM: "llm_call",
  TOOL: "tool_execution",
  CHAIN: "chain_operation",
  AGENT: "agent_invocation",
  RETRIEVER: "retrieval",
  EMBEDDING: "embedding",
} as const;

// Standard OpenTelemetry detection patterns
export const STANDARD_OPENTELEMETRY_PATTERNS = {
  HTTP_KEYWORDS: [],
  DATABASE_KEYWORDS: [],
  FUNCTION_KEYWORDS: ["tool", "function"],
  LLM_KEYWORDS: ["openai", "anthropic", "gpt", "claude"],
  CHAIN_KEYWORDS: ["chain", "workflow", "langchain"],
  AGENT_KEYWORDS: ["agent"],
  RETRIEVAL_KEYWORDS: ["pinecone", "chroma", "retrieval", "vector", "search"],
} as const;

export const INPUT_OUTPUT_ATTRIBUTES = {
  INPUT_VALUE: "input.value",
  OUTPUT_VALUE: "output.value",
} as const;
