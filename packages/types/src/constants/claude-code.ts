// Attribute keys the Claude Code adapter writes on top of the GenAI ones
export const CLAUDE_CODE_ATTRIBUTES = {
  RESPONSE_ID: "gen_ai.response.id",
  RESPONSE_FINISH_REASONS: "gen_ai.response.finish_reasons",
  TOOL_CALL_ID: "gen_ai.tool.call.id",
  ERROR_MESSAGE: "error.message",
  // Context window attributes
  CUMULATIVE_TOKENS: "claude_code.cumulative_tokens",
  CACHE_HIT_RATIO: "claude_code.cache_hit_ratio",
  // Prefixes for transcript fields that are passed through as they are
  PREFIX: "claude_code.",
  MESSAGE_PREFIX: "claude_code.message.",
  USAGE_PREFIX: "claude_code.usage.",
  TOOL_USE_PREFIX: "claude_code.tool_use.",
  TOOL_INPUT_PREFIX: "claude_code.input.",
  TOOL_RESULT_PREFIX: "claude_code.toolUseResult.",
  SUBAGENT_PREFIX: "claude_code.subagent.",
} as const;
