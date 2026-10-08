import type { TraceSpan } from "@evilmartians/agent-prism-types";

export const llmSpan: TraceSpan = {
  attributes: [
    {
      key: "llm.model",
      value: { stringValue: "gpt-4" },
    },
    {
      key: "llm.temperature",
      value: { intValue: "0.7" },
    },
  ],
  endTime: new Date("2024-01-15T10:30:03Z"),
  id: "span-llm-001",
  raw: [
    JSON.stringify({
      max_tokens: 1000,
      model: "gpt-4",
      prompt: "Generate a creative story about AI",
      temperature: 0.7,
    }),
  ],
  startTime: new Date("2024-01-15T10:30:00Z"),
  status: "success",
  title: "GPT-4 Text Generation",
  tokenUsage: {
    input: { cost: 0.018, tokens: 600 },
    output: { cost: 0.027, tokens: 250 },
  },
  type: "llm_call",
};
