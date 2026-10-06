import type { TraceRecord } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TraceList, TraceListSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";
import { fn } from "storybook/test";

const meta = {
  argTypes: {
    className: {
      control: "text",
      description: "Optional className for the root container",
    },
    expanded: {
      control: "boolean",
      description: "Whether the trace list is expanded",
    },
    selectedTrace: {
      description: "Currently selected trace for highlighting",
    },
    traces: {
      description: "Array of trace records to display",
    },
  },
  component: TraceList,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={TraceListSource} language="tsx" />
        </>
      ),
    },
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Main Components/TraceList",
} satisfies Meta<typeof TraceList>;

const mockTraces: TraceRecord[] = [
  {
    agentDescription: "Authentication service handling user login",
    durationMs: 1250,
    id: "trace-001",
    name: "User Authentication Flow",
    spansCount: 8,
  },
  {
    agentDescription: "ETL pipeline processing user data",
    durationMs: 3400,
    id: "trace-002",
    name: "Data Processing Pipeline",
    spansCount: 15,
  },
  {
    agentDescription: "Gateway routing and validation",
    durationMs: 890,
    id: "trace-003",
    name: "API Gateway Request",
    spansCount: 5,
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    expanded: true,
    onExpandStateChange: fn(),
    traces: mockTraces,
  },
};

export const Collapsed: Story = {
  args: {
    expanded: false,
    onExpandStateChange: fn(),
    traces: mockTraces,
  },
};

export const SelectedTrace: Story = {
  args: {
    expanded: true,
    onExpandStateChange: fn(),
    onTraceSelect: (trace) => console.log("Selected:", trace),
    selectedTrace: mockTraces[1],
    traces: mockTraces,
  },
};

export const EmptyList: Story = {
  args: {
    expanded: true,
    onExpandStateChange: fn(),
    traces: [],
  },
};

export const SingleTrace: Story = {
  args: {
    expanded: true,
    onExpandStateChange: fn(),
    traces: mockTraces.slice(0, 1),
  },
};
