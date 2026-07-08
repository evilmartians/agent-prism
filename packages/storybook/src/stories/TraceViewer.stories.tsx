import type {
  LangfuseDocument,
  OpenTelemetryDocument,
  TraceSpan,
} from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  langfuseSpanAdapter,
  openTelemetrySpanAdapter,
} from "@evilmartians/agent-prism-data";
import {
  TraceViewer,
  type TraceViewerData,
} from "@evilmartians/agent-prism-ui";

import langfuseData1 from "../data/langfuse-1.json";
import langfuseData2 from "../data/langfuse-2.json";
import langfuseData3 from "../data/langfuse-3.json";
import testData1 from "../data/test_data_1.json";
import testData2 from "../data/test_data_2.json";
import testData3 from "../data/test_data_3.json";

const meta: Meta<typeof TraceViewer> = {
  title: "Demo/TraceViewer",
  component: TraceViewer,
  parameters: {},
};

const agentData1 = openTelemetrySpanAdapter.convertRawDocumentsToSpans(
  testData1 as OpenTelemetryDocument[],
);
const agentData2 = openTelemetrySpanAdapter.convertRawDocumentsToSpans(
  testData2 as OpenTelemetryDocument[],
);

const agentData3 = openTelemetrySpanAdapter.convertRawDocumentsToSpans(
  testData3 as OpenTelemetryDocument[],
);

const langfuse1 = langfuseSpanAdapter.convertRawDocumentsToSpans(
  langfuseData1 as LangfuseDocument,
);
const langfuse2 = langfuseSpanAdapter.convertRawDocumentsToSpans(
  langfuseData2 as LangfuseDocument,
);
const langfuse3 = langfuseSpanAdapter.convertRawDocumentsToSpans(
  langfuseData3 as LangfuseDocument,
);

const errorSpan = (
  span: Partial<TraceSpan> & Pick<TraceSpan, "id">,
): TraceSpan => ({
  title: span.id,
  startTime: new Date("2024-01-15T10:30:00Z"),
  endTime: new Date("2024-01-15T10:30:03Z"),
  duration: 3000,
  type: "span",
  raw: "{}",
  status: "success",
  ...span,
});

// A run that failed end-to-end: the error propagates from a leaf tool call up
// through the agent to the root chain, so every span on the path is failed.
const failedRunSpans: TraceSpan[] = [
  errorSpan({
    id: "failed-root",
    title: "Relevancy scoring workflow",
    type: "chain_operation",
    status: "error",
    raw: JSON.stringify({
      status: { message: "Run failed" },
      name: "Relevancy scoring workflow",
    }),
    children: [
      errorSpan({
        id: "failed-agent",
        title: "AI Agent",
        type: "agent_invocation",
        status: "error",
        raw: JSON.stringify({
          status: { message: "Child node failed" },
          name: "AI Agent",
        }),
        children: [
          errorSpan({
            id: "failed-parser",
            title: "Structured Output Parser",
            type: "tool_execution",
            status: "error",
            raw: JSON.stringify({
              status: {
                code: "ERROR",
                message: "Model output doesn't fit required format",
              },
              name: "Structured Output Parser",
            }),
          }),
        ],
      }),
    ],
  }),
];

// A run that mostly succeeded but has one failed tool call among healthy
// siblings — the partial-failure case.
const partialFailureSpans: TraceSpan[] = [
  errorSpan({
    id: "partial-root",
    title: "Customer support workflow",
    type: "chain_operation",
    children: [
      errorSpan({
        id: "partial-ok-1",
        title: "Fetch conversation",
        type: "tool_execution",
      }),
      errorSpan({
        id: "partial-error",
        title: "Redis connection",
        type: "tool_execution",
        status: "error",
        attributes: [
          {
            key: "exception.message",
            value: { stringValue: "Connection refused: redis:6379" },
          },
          {
            key: "exception.stacktrace",
            value: {
              stringValue: [
                "Error: Connection refused: redis:6379",
                "    at RedisClient.connect (/app/node_modules/redis/client.js:142:19)",
                "    at async CacheService.get (/app/src/cache.ts:38:5)",
              ].join("\n"),
            },
          },
        ],
      }),
      errorSpan({
        id: "partial-ok-2",
        title: "Draft reply",
        type: "llm_call",
      }),
    ],
  }),
];

const data: TraceViewerData[] = [
  {
    traceRecord: {
      id: "failed-run",
      name: "failed-run",
      spansCount: 3,
      durationMs: 3000,
      agentDescription: "relevancy-scoring-agent",
      startTime: Date.now(),
    },
    spans: failedRunSpans,
    badges: [
      {
        label: "app: prod-scorer",
      },
    ],
  },
  {
    traceRecord: {
      id: "partial-failure",
      name: "partial-failure",
      spansCount: 4,
      durationMs: 3000,
      agentDescription: "customer-support-ai",
      startTime: Date.now(),
    },
    spans: partialFailureSpans,
    badges: [
      {
        label: "app: prod-support",
      },
    ],
  },
  {
    traceRecord: {
      id: "test-data-1",
      name: "test-data-1",
      spansCount: 29,
      durationMs: 37_000,
      agentDescription: "research-agent",
      startTime: Date.now(),
    },
    spans: agentData1,
    badges: [
      {
        label: "app: dev-chatbot",
      },
    ],
  },
  {
    traceRecord: {
      id: "test-data-2",
      name: "test-data-2",
      spansCount: 8,
      durationMs: 94_000,
      agentDescription: "data-analysis-bot",
      startTime: Date.now(),
    },
    spans: agentData2,
    badges: [
      {
        label: "app: staging-assistant",
      },
    ],
  },
  {
    traceRecord: {
      id: "test-data-3",
      name: "test-data-3",
      spansCount: 18,
      durationMs: 51_000,
      agentDescription: "customer-support-ai",
      startTime: Date.now(),
    },
    spans: agentData3,
    badges: [
      {
        label: "app: prod-analyzer",
      },
    ],
  },
  {
    traceRecord: {
      id: "langfuse-1",
      name: "langfuse-1",
      spansCount: 11,
      durationMs: 54_000,
      agentDescription: "langfuse-1",
    },
    spans: langfuse1,
    badges: [
      {
        label: "app: demo-qa",
      },
    ],
    spanCardViewOptions: {
      withStatus: false,
    },
  },
  {
    traceRecord: {
      id: "langfuse-2",
      name: "langfuse-2",
      spansCount: 11,
      durationMs: 30_000,
      agentDescription: "langfuse-2",
    },
    spans: langfuse2,
    badges: [
      {
        label: "app: demo-qa",
      },
    ],
    spanCardViewOptions: {
      withStatus: false,
    },
  },
  {
    traceRecord: {
      id: "langfuse-3",
      name: "langfuse-3",
      spansCount: 5,
      durationMs: 5000,
      agentDescription: "langfuse-3",
    },
    spans: langfuse3,
    badges: [
      {
        label: "app: demo-qa",
      },
    ],
    spanCardViewOptions: {
      withStatus: false,
    },
  },
];

export const TraceViewerStory: Story = {
  render: () => {
    return <TraceViewer data={data} />;
  },
};

export default meta;
type Story = StoryObj<typeof TraceViewer>;
