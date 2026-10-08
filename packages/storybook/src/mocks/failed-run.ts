import { mockSpan } from "./span";

export const failedParserSpan = mockSpan({
  id: "span-parser",
  raw: [
    JSON.stringify({
      name: "Structured Output Parser",
      status: {
        code: "ERROR",
        message: "Model output doesn't fit required format",
      },
    }),
  ],
  status: "error",
  title: "Structured Output Parser",
  type: "tool_execution",
});

export const failedRunRootSpan = mockSpan({
  children: [
    mockSpan({
      children: [failedParserSpan],
      id: "span-agent",
      raw: [
        JSON.stringify({
          name: "AI Agent",
          status: { message: "Child node failed" },
        }),
      ],
      status: "error",
      title: "AI Agent",
      type: "agent_invocation",
    }),
  ],
  id: "span-root",
  raw: [
    JSON.stringify({
      name: "Relevancy scoring workflow",
      status: { message: "Run failed" },
    }),
  ],
  status: "error",
  title: "Relevancy scoring workflow",
  type: "chain_operation",
});
