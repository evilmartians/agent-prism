import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  isLangfuseDocument,
  isOpenTelemetryDocument,
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
import { failedRunRootSpan } from "../mocks/failed-run";
import { mockSpan } from "../mocks/span";

const meta: Meta<typeof TraceViewer> = {
  component: TraceViewer,
  parameters: {},
  title: "Demo/TraceViewer",
};

const openTelemetrySpans = (documents: readonly unknown[]): TraceSpan[] =>
  openTelemetrySpanAdapter.convertRawDocumentsToSpans(
    documents.filter(isOpenTelemetryDocument),
  );

const langfuseSpans = (document: unknown): TraceSpan[] =>
  langfuseSpanAdapter.convertRawDocumentsToSpans(
    [document].filter(isLangfuseDocument),
  );

const agentData1 = openTelemetrySpans(testData1);
const agentData2 = openTelemetrySpans(testData2);

const agentData3 = openTelemetrySpans(testData3);

const langfuse1 = langfuseSpans(langfuseData1);
const langfuse2 = langfuseSpans(langfuseData2);
const langfuse3 = langfuseSpans(langfuseData3);

const partialFailureSpans = [
  mockSpan({
    children: [
      mockSpan({
        id: "partial-ok-1",
        title: "Fetch conversation",
        type: "tool_execution",
      }),
      mockSpan({
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
        id: "partial-error",
        status: "error",
        title: "Redis connection",
        type: "tool_execution",
      }),
      mockSpan({
        id: "partial-ok-2",
        title: "Draft reply",
        type: "llm_call",
      }),
    ],
    id: "partial-root",
    title: "Customer support workflow",
    type: "chain_operation",
  }),
];

const data: DeepReadonly<TraceViewerData[]> = [
  {
    badges: [
      {
        label: "app: prod-scorer",
      },
    ],
    spans: [failedRunRootSpan],
    traceRecord: {
      agentDescription: "relevancy-scoring-agent",
      durationMs: 3000,
      id: "failed-run",
      name: "failed-run",
      spansCount: 3,
      startTime: Date.now(),
    },
  },
  {
    badges: [
      {
        label: "app: prod-support",
      },
    ],
    spans: partialFailureSpans,
    traceRecord: {
      agentDescription: "customer-support-ai",
      durationMs: 3000,
      id: "partial-failure",
      name: "partial-failure",
      spansCount: 4,
      startTime: Date.now(),
    },
  },
  {
    badges: [
      {
        label: "app: dev-chatbot",
      },
    ],
    spans: agentData1,
    traceRecord: {
      agentDescription: "research-agent",
      durationMs: 37_000,
      id: "test-data-1",
      name: "test-data-1",
      spansCount: 29,
      startTime: Date.now(),
    },
  },
  {
    badges: [
      {
        label: "app: staging-assistant",
      },
    ],
    spans: agentData2,
    traceRecord: {
      agentDescription: "data-analysis-bot",
      durationMs: 94_000,
      id: "test-data-2",
      name: "test-data-2",
      spansCount: 8,
      startTime: Date.now(),
    },
  },
  {
    badges: [
      {
        label: "app: prod-analyzer",
      },
    ],
    spans: agentData3,
    traceRecord: {
      agentDescription: "customer-support-ai",
      durationMs: 51_000,
      id: "test-data-3",
      name: "test-data-3",
      spansCount: 18,
      startTime: Date.now(),
    },
  },
  {
    badges: [
      {
        label: "app: demo-qa",
      },
    ],
    spanCardViewOptions: {
      withStatus: false,
    },
    spans: langfuse1,
    traceRecord: {
      agentDescription: "langfuse-1",
      durationMs: 54_000,
      id: "langfuse-1",
      name: "langfuse-1",
      spansCount: 11,
    },
  },
  {
    badges: [
      {
        label: "app: demo-qa",
      },
    ],
    spanCardViewOptions: {
      withStatus: false,
    },
    spans: langfuse2,
    traceRecord: {
      agentDescription: "langfuse-2",
      durationMs: 30_000,
      id: "langfuse-2",
      name: "langfuse-2",
      spansCount: 11,
    },
  },
  {
    badges: [
      {
        label: "app: demo-qa",
      },
    ],
    spanCardViewOptions: {
      withStatus: false,
    },
    spans: langfuse3,
    traceRecord: {
      agentDescription: "langfuse-3",
      durationMs: 5000,
      id: "langfuse-3",
      name: "langfuse-3",
      spansCount: 5,
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
