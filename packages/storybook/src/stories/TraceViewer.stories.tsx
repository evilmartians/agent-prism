import type { OpenTelemetryDocument } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { convertOTelDocumentToSpanCards } from "@evilmartians/agent-prism-data";
import {
  TraceViewer,
  type TraceViewerProps,
} from "@evilmartians/agent-prism-ui";

import testData1 from "../data/test_data_1.json";
import testData2 from "../data/test_data_2.json";
import testData3 from "../data/test_data_3.json";

const meta: Meta<typeof TraceViewer> = {
  title: "Demo/TraceViewer",
  component: TraceViewer,
  parameters: {},
};

const agentData1 = convertOTelDocumentToSpanCards(
  testData1 as OpenTelemetryDocument[],
);
const agentData2 = convertOTelDocumentToSpanCards(
  testData2 as OpenTelemetryDocument[],
);

const agentData3 = convertOTelDocumentToSpanCards(
  testData3 as OpenTelemetryDocument[],
);

const data: TraceViewerProps["data"] = [
  {
    traceRecord: {
      id: "test-data-1",
      name: "7a8b9c1d",
      spansCount: 24,
      durationMs: 3200,
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
      name: "f2e3d4c5",
      spansCount: 156,
      durationMs: 45670,
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
      name: "9b8a7c6d",
      spansCount: 13,
      durationMs: 2500,
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
];

export const TraceViewerStory: Story = {
  render: () => {
    return <TraceViewer data={data} />;
  },
};

export default meta;
type Story = StoryObj<typeof TraceViewer>;
