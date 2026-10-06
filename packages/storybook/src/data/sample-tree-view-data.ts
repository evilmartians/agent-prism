import type { TraceSpan } from "@evilmartians/agent-prism-types";

export const sampleTreeViewData: TraceSpan[] = [
  {
    attributes: [
      { key: "app.name", value: { stringValue: "ai-research-agent" } },
      { key: "app.environment", value: { stringValue: "production" } },
      { key: "langchain.chain", value: { stringValue: "MainSequence" } },
      { key: "user.id", value: { stringValue: "user-123" } },
      { key: "session.id", value: { stringValue: "session-abc-456" } },
    ],
    children: [
      {
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
            attributes: [
              { key: "gen_ai.request.model", value: { stringValue: "gpt-4" } },
              { key: "gen_ai.usage.input_tokens", value: { intValue: "150" } },
              { key: "gen_ai.usage.output_tokens", value: { intValue: "100" } },
              { key: "gen_ai.request.max_tokens", value: { intValue: "1000" } },
              { key: "http.method", value: { stringValue: "POST" } },
              { key: "http.status_code", value: { intValue: "200" } },
              { key: "retry.enabled", value: { boolValue: true } },
            ],
            endTime: new Date("2023-01-01T00:00:45Z"),
            id: "1-1-1",
            raw: [
              `{"span_id": "chat-completion-001", "status": "PENDING", "retry": true}`,
            ],
            startTime: new Date("2023-01-01T00:00:15Z"),
            status: "pending",
            title: "ChatCompletion",
            tokenUsage: { total: { cost: 75, tokens: 250 } },
            type: "llm_call",
          },
          {
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
            endTime: new Date("2023-01-01T00:01:30Z"),
            id: "1-1-2",
            raw: [
              `{"span_id": "chat-completion-002", "error": "rate_limit_exceeded", "retry_count": 3}`,
            ],
            startTime: new Date("2023-01-01T00:00:45Z"),
            status: "error",
            title: "ChatCompletion",
            tokenUsage: { total: { cost: 75, tokens: 250 } },
            type: "llm_call",
          },
        ],
        endTime: new Date("2023-01-01T00:05:00Z"),
        id: "1-1",
        raw: [
          `{"span_id": "chat-completions-001", "model": "gpt-4", "tokens": 500}`,
        ],
        startTime: new Date("2023-01-01T00:00:10Z"),
        status: "success",
        title: "ChatCompletions",
        tokenUsage: { total: { cost: 150, tokens: 500 } },
        type: "llm_call",
      },
      {
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
        endTime: new Date("2023-01-01T00:05:00Z"),
        id: "1-2",
        raw: [
          `{"span_id": "sequence-001", "chain": "DocumentProcessingChain", "docs": 5}`,
        ],
        startTime: new Date("2023-01-01T00:01:00Z"),
        status: "success",
        title: "RunnableSequence",
        tokenUsage: { total: { cost: 80, tokens: 200 } },
        type: "chain_operation",
      },
      {
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
        endTime: new Date("2023-01-01T00:02:00Z"),
        id: "1-3",
        raw: [
          `{"span_id": "agent-search-001", "query": "AI trends 2024", "results": 10}`,
        ],
        startTime: new Date("2023-01-01T00:01:30Z"),
        status: "success",
        title: "agent_search",
        tokenUsage: { total: { cost: 25, tokens: 100 } },
        type: "tool_execution",
      },
      {
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
            attributes: [
              {
                key: "langchain.runnable",
                value: { stringValue: "VariableAssigner" },
              },
              { key: "variables.assigned", value: { intValue: "3" } },
              { key: "error.type", value: { stringValue: "validation_error" } },
              { key: "error.field", value: { stringValue: "temperature" } },
            ],
            endTime: new Date("2023-01-01T00:02:10Z"),
            id: "1-4-1",
            raw: [
              `{"span_id": "assign-001", "error": "validation_error", "field": "temperature"}`,
            ],
            startTime: new Date("2023-01-01T00:02:05Z"),
            status: "error",
            title: "RunnableAssign",
            tokenUsage: { total: { cost: 15, tokens: 50 } },
            type: "chain_operation",
          },
          {
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
            endTime: new Date("2023-01-01T00:02:15Z"),
            id: "1-4-2",
            raw: [
              `{"span_id": "template-001", "error": "template_error", "missing": "context"}`,
            ],
            startTime: new Date("2023-01-01T00:02:10Z"),
            status: "error",
            title: "ChatPromptTemplate",
            tokenUsage: { total: { cost: 5, tokens: 100 } },
            type: "llm_call",
          },
        ],
        endTime: new Date("2023-01-01T00:05:00Z"),
        id: "1-4",
        raw: [
          `{"span_id": "sequence-002", "chain": "ContentSynthesisChain", "status": "PENDING"}`,
        ],
        startTime: new Date("2023-01-01T00:02:00Z"),
        status: "pending",
        title: "RunnableSequence",
        tokenUsage: { total: { cost: 90, tokens: 300 } },
        type: "chain_operation",
      },
      {
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
        endTime: new Date("2023-01-01T00:02:20Z"),
        id: "1-5",
        raw: [
          `{"span_id": "extract-001", "urls": 2, "status": "PENDING", "progress": 50}`,
        ],
        startTime: new Date("2023-01-01T00:02:15Z"),
        status: "pending",
        title: "agent_extract",
        tokenUsage: { total: { cost: 20, tokens: 150 } },
        type: "tool_execution",
      },
      {
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
        endTime: new Date("2023-01-01T00:02:25Z"),
        id: "1-6",
        raw: [
          `{"span_id": "assign-002", "operation": "SummaryAssigner", "compression": 0.15}`,
        ],
        startTime: new Date("2023-01-01T00:02:20Z"),
        status: "success",
        title: "RunnableAssign",
        tokenUsage: { total: { cost: 15, tokens: 50 } },
        type: "chain_operation",
      },
      {
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
        endTime: new Date("2023-01-01T00:02:30Z"),
        id: "1-7",
        raw: [
          `{"span_id": "template-002", "template": "summary_report", "format": "markdown"}`,
        ],
        startTime: new Date("2023-01-01T00:02:25Z"),
        status: "success",
        title: "ChatPromptTemplate",
        tokenUsage: { total: { cost: 5, tokens: 100 } },
        type: "llm_call",
      },
    ],
    endTime: new Date("2023-01-01T00:06:12Z"),
    id: "1",
    raw: [`{"span_id": "main-001", "status": "SUCCESS", "duration_ms": 37220}`],
    startTime: new Date("2023-01-01T00:00:00Z"),
    status: "success",
    title: "main",
    tokenUsage: { total: { cost: 1234, tokens: 1000 } },
    type: "chain_operation",
  },
];
