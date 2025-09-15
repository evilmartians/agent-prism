import type { LangfuseDocument, OpenTelemetryDocument } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { convertLangfuseDocumentToSpanCards, convertOTelDocumentToSpanCards } from "@evilmartians/agent-prism-data";
import { TraceViewer } from "@evilmartians/agent-prism-ui";

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

const agentData1 = convertOTelDocumentToSpanCards(
  testData1 as OpenTelemetryDocument[],
);
const agentData2 = convertOTelDocumentToSpanCards(
  testData2 as OpenTelemetryDocument[],
);

const agentData3 = convertOTelDocumentToSpanCards(
  testData3 as OpenTelemetryDocument[],
);

const langfuse1 = convertLangfuseDocumentToSpanCards(
  langfuseData1 as LangfuseDocument,
);
const langfuse2 = convertLangfuseDocumentToSpanCards(
  langfuseData2 as LangfuseDocument,
);
const langfuse3 = convertLangfuseDocumentToSpanCards(
  langfuseData3 as LangfuseDocument,
);


const data = [
  {
    traceRecord: {
      id: "test-data-1",
      name: "7a8b9c1d",
      spansCount: 24,
      durationMs: 3200,
      agentDescription: "research-agent",
    },
    spans: agentData1,
  },
  {
    traceRecord: {
      id: "test-data-2",
      name: "f2e3d4c5",
      spansCount: 156,
      durationMs: 45670,
      agentDescription: "data-analysis-bot",
    },
    spans: agentData2,
  },
  {
    traceRecord: {
      id: "test-data-3",
      name: "9b8a7c6d",
      spansCount: 13,
      durationMs: 2500,
      agentDescription: "customer-support-ai",
    },
    spans: agentData3,
  },
  {
    traceRecord: {
      id: "langfuse-1",
      name: "langfuse-1",
      spansCount: 13,
      durationMs: 2500,
      agentDescription: "langfuse-1",
    },
    spans: langfuse1,
  },
  {
    traceRecord: {
      id: "langfuse-2",
      name: "langfuse-2",
      spansCount: 13,
      durationMs: 2500,
      agentDescription: "langfuse-2",
    },
    spans: langfuse2,
  },
  {
    traceRecord: {
      id: "langfuse-3",
      name: "langfuse-3",
      spansCount: 13,
      durationMs: 2500,
      agentDescription: "langfuse-3",
    },
    spans: langfuse3,
  },
];

export const TraceViewerStory: Story = {
  render: () => {
    return <TraceViewer data={data} />;
  },
};

export default meta;
type Story = StoryObj<typeof TraceViewer>;
