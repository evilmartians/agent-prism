import type {
  LangfuseDocument,
  OpenTelemetryDocument,
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

const data: TraceViewerData[] = [
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
        theme: "sky",
      },
      {
        label: "env: dev",
        theme: "gray",
      },
      {
        label: "gpt-4",
        theme: "purple",
      },
      {
        label: "5 tools",
        theme: "orange",
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
        theme: "sky",
      },
      {
        label: "env: staging",
        theme: "gray",
      },
      {
        label: "claude-3-sonnet",
        theme: "purple",
      },
      {
        label: "10 tools",
        theme: "orange",
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
        theme: "sky",
      },
      {
        label: "env: production",
        theme: "gray",
      },
      {
        label: "gpt-4-turbo",
        theme: "purple",
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
        theme: "sky",
      },
      {
        label: "env: production",
        theme: "gray",
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
        theme: "sky",
      },
      {
        label: "env: production",
        theme: "gray",
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
        theme: "sky",
      },
      {
        label: "env: production",
        theme: "gray",
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
