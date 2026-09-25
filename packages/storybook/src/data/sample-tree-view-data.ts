import type { TraceSpan } from "@evilmartians/agent-prism-types";

export const sampleTreeViewData: TraceSpan[] = [
  {
    id: "1",
    title: "main",
    startTime: new Date("2023-01-01T00:00:00Z"),
    endTime: new Date("2023-01-01T00:06:12Z"),
    tokenUsage: { total: { tokens: 1000, cost: 1234 } },
    type: "chain_operation",
    status: "success",
    raw: [`{"span_id": "main-001", "status": "SUCCESS", "duration_ms": 37220}`],
    attributes: [
      { key: "app.name", value: { stringValue: "ai-research-agent" } },
      { key: "app.environment", value: { stringValue: "production" } },
      { key: "langchain.chain", value: { stringValue: "MainSequence" } },
      { key: "user.id", value: { stringValue: "user-123" } },
      { key: "session.id", value: { stringValue: "session-abc-456" } },
    ],
    children: [
      {
        id: "1-1",
        title: "ChatCompletions",
        startTime: new Date("2023-01-01T00:00:10Z"),
        endTime: new Date("2023-01-01T00:05:00Z"),
        tokenUsage: { total: { tokens: 500, cost: 150 } },
        type: "llm_call",
        status: "success",
        raw: [
          `{"span_id": "chat-completions-001", "model": "gpt-4", "tokens": 500}`,
        ],
        attributes: [
          { key: "gen_ai.request.model", value: { stringValue: "gpt-4" } },
          { key: "gen_ai.usage.input_tokens", value: { intValue: "300" } },
          { key: "gen_ai.usage.output_tokens", value: { intValue: "200" } },
          { key: "gen_ai.usage.total_tokens", value: { intValue: "500" } },
          { key: "gen_ai.request.temperature", value: { stringValue: "0.7" } },
          { key: "openinference.span.kind", value: { stringValue: "LLM" } },
        ],
        children: [
          {
            id: "1-1-1",
            title: "ChatCompletion",
            startTime: new Date("2023-01-01T00:00:15Z"),
            endTime: new Date("2023-01-01T00:00:45Z"),
            tokenUsage: { total: { tokens: 250, cost: 75 } },
            status: "pending",
            type: "llm_call",
            raw: [
              `{"span_id": "chat-completion-001", "status": "PENDING", "retry": true}`,
            ],
            attributes: [
              { key: "gen_ai.request.model", value: { stringValue: "gpt-4" } },
              { key: "gen_ai.usage.input_tokens", value: { intValue: "150" } },
              { key: "gen_ai.usage.output_tokens", value: { intValue: "100" } },
              { key: "gen_ai.request.max_tokens", value: { intValue: "1000" } },
              { key: "http.method", value: { stringValue: "POST" } },
              { key: "http.status_code", value: { intValue: "200" } },
              { key: "retry.enabled", value: { boolValue: true } },
            ],
          },
          {
            id: "1-1-2",
            title: "ChatCompletion",
            startTime: new Date("2023-01-01T00:00:45Z"),
            endTime: new Date("2023-01-01T00:01:30Z"),
            tokenUsage: { total: { tokens: 250, cost: 75 } },
            status: "error",
            type: "llm_call",
            raw: [
              `{"span_id": "chat-completion-002", "error": "rate_limit_exceeded", "retry_count": 3}`,
            ],
            attributes: [
              { key: "gen_ai.request.model", value: { stringValue: "gpt-4" } },
              { key: "gen_ai.usage.input_tokens", value: { intValue: "150" } },
              { key: "gen_ai.usage.output_tokens", value: { intValue: "100" } },
              {
                key: "error.type",
                value: { stringValue: "rate_limit_exceeded" },
              },
              {
                key: "error.message",
                value: { stringValue: "API rate limit exceeded" },
              },
              { key: "http.status_code", value: { intValue: "429" } },
              { key: "retry.count", value: { intValue: "3" } },
            ],
          },
        ],
      },
      {
        id: "1-2",
        title: "RunnableSequence",
        startTime: new Date("2023-01-01T00:01:00Z"),
        endTime: new Date("2023-01-01T00:05:00Z"),
        tokenUsage: { total: { tokens: 200, cost: 80 } },
        status: "success",
        type: "chain_operation",
        raw: [
          `{"span_id": "sequence-001", "chain": "DocumentProcessingChain", "docs": 5}`,
        ],
        attributes: [
          {
            key: "langchain.chain",
            value: { stringValue: "DocumentProcessingChain" },
          },
          { key: "langchain.chain.type", value: { stringValue: "sequential" } },
          { key: "documents.count", value: { intValue: "5" } },
          { key: "cache.enabled", value: { boolValue: true } },
          { key: "cache.hit", value: { boolValue: false } },
        ],
      },
      {
        id: "1-3",
        title: "agent_search",
        startTime: new Date("2023-01-01T00:01:30Z"),
        endTime: new Date("2023-01-01T00:02:00Z"),
        tokenUsage: { total: { tokens: 100, cost: 25 } },
        status: "success",
        type: "tool_execution",
        raw: [
          `{"span_id": "agent-search-001", "query": "AI trends 2024", "results": 10}`,
        ],
        attributes: [
          { key: "function.name", value: { stringValue: "agent_search" } },
          {
            key: "function.parameters",
            value: { stringValue: '{"query": "AI trends 2024"}' },
          },
          { key: "http.method", value: { stringValue: "POST" } },
          { key: "http.status_code", value: { intValue: "200" } },
          { key: "search.results_count", value: { intValue: "10" } },
        ],
      },
      {
        id: "1-4",
        title: "RunnableSequence",
        startTime: new Date("2023-01-01T00:02:00Z"),
        endTime: new Date("2023-01-01T00:05:00Z"),
        status: "pending",
        tokenUsage: { total: { tokens: 300, cost: 90 } },
        type: "chain_operation",
        raw: [
          `{"span_id": "sequence-002", "chain": "ContentSynthesisChain", "status": "PENDING"}`,
        ],
        attributes: [
          {
            key: "langchain.chain",
            value: { stringValue: "ContentSynthesisChain" },
          },
          { key: "langchain.chain.type", value: { stringValue: "parallel" } },
          { key: "processing.mode", value: { stringValue: "batch" } },
          { key: "timeout.seconds", value: { intValue: "30" } },
        ],
        children: [
          {
            id: "1-4-1",
            title: "RunnableAssign",
            startTime: new Date("2023-01-01T00:02:05Z"),
            endTime: new Date("2023-01-01T00:02:10Z"),
            tokenUsage: { total: { tokens: 50, cost: 15 } },
            status: "error",
            type: "chain_operation",
            raw: [
              `{"span_id": "assign-001", "error": "validation_error", "field": "temperature"}`,
            ],
            attributes: [
              {
                key: "langchain.runnable",
                value: { stringValue: "VariableAssigner" },
              },
              { key: "variables.assigned", value: { intValue: "3" } },
              { key: "error.type", value: { stringValue: "validation_error" } },
              { key: "error.field", value: { stringValue: "temperature" } },
            ],
          },
          {
            id: "1-4-2",
            title: "ChatPromptTemplate",
            startTime: new Date("2023-01-01T00:02:10Z"),
            endTime: new Date("2023-01-01T00:02:15Z"),
            tokenUsage: { total: { tokens: 100, cost: 5 } },
            status: "error",
            type: "llm_call",
            raw: [
              `{"span_id": "template-001", "error": "template_error", "missing": "context"}`,
            ],
            attributes: [
              {
                key: "llm.prompt_template.template",
                value: { stringValue: "Analyze the following data: {data}" },
              },
              {
                key: "llm.prompt_template.variables",
                value: { stringValue: "data,context,format" },
              },
              { key: "template.tokens", value: { intValue: "50" } },
              { key: "error.type", value: { stringValue: "template_error" } },
              {
                key: "error.message",
                value: { stringValue: "Missing required variable: context" },
              },
            ],
          },
        ],
      },
      {
        id: "1-5",
        title: "agent_extract",
        startTime: new Date("2023-01-01T00:02:15Z"),
        endTime: new Date("2023-01-01T00:02:20Z"),
        status: "pending",
        tokenUsage: { total: { tokens: 150, cost: 20 } },
        type: "tool_execution",
        raw: [
          `{"span_id": "extract-001", "urls": 2, "status": "PENDING", "progress": 50}`,
        ],
        attributes: [
          { key: "function.name", value: { stringValue: "agent_extract" } },
          {
            key: "function.parameters",
            value: { stringValue: '{"urls": ["url1", "url2"]}' },
          },
          { key: "extraction.mode", value: { stringValue: "smart" } },
          { key: "urls.count", value: { intValue: "2" } },
          { key: "content.length", value: { intValue: "5420" } },
          { key: "rate_limit.remaining", value: { intValue: "95" } },
        ],
      },
      {
        id: "1-6",
        title: "RunnableAssign",
        startTime: new Date("2023-01-01T00:02:20Z"),
        endTime: new Date("2023-01-01T00:02:25Z"),
        tokenUsage: { total: { tokens: 50, cost: 15 } },
        status: "success",
        type: "chain_operation",
        raw: [
          `{"span_id": "assign-002", "operation": "SummaryAssigner", "compression": 0.15}`,
        ],
        attributes: [
          {
            key: "langchain.runnable",
            value: { stringValue: "SummaryAssigner" },
          },
          { key: "variables.assigned", value: { intValue: "2" } },
          { key: "summary.length", value: { intValue: "340" } },
          { key: "compression.ratio", value: { stringValue: "0.15" } },
          { key: "performance.optimized", value: { boolValue: true } },
        ],
      },
      {
        id: "1-7",
        title: "ChatPromptTemplate",
        startTime: new Date("2023-01-01T00:02:25Z"),
        endTime: new Date("2023-01-01T00:02:30Z"),
        tokenUsage: { total: { tokens: 100, cost: 5 } },
        status: "success",
        type: "llm_call",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        attributes: [
          {
            key: "llm.prompt_template.template",
            value: { stringValue: "Create a summary based on: {summary}" },
          },
          {
            key: "llm.prompt_template.variables",
            value: { stringValue: "summary,style,length" },
          },
          { key: "template.tokens", value: { intValue: "25" } },
          { key: "output.format", value: { stringValue: "markdown" } },
          { key: "quality.check", value: { boolValue: true } },
        ],
      },
    ],
  },
];
