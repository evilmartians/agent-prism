import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TreeView, TreeViewSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Main Components/TreeView",
  component: TreeView,
  parameters: {
    layout: "padded",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={TreeViewSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    spans: {
      description:
        "Array of root-level trace spans to display in tree structure",
    },
    selectedSpan: {
      description: "Currently selected span for highlighting",
    },
    spanCardViewOptions: {
      control: { type: "object" },
      description: "View options for the span card",
      defaultValue: {
        expandButton: "outside",
        withStatus: true,
      },
    },
    expandedSpansIds: {
      description: "Array of span IDs that are currently expanded",
    },
    className: {
      control: "text",
      description: "Optional className for the tree container",
    },
  },
} satisfies Meta<typeof TreeView>;

const mockSpans: TraceSpan[] = [
  {
    id: "span-root-001",
    title: "Root Span - API Request",
    startTime: new Date("2024-01-15T10:30:00Z"),
    endTime: new Date("2024-01-15T10:30:05Z"),
    duration: 5000,
    cost: 0.12,
    type: "llm_call",
    raw: JSON.stringify({ endpoint: "/api/process" }),
    attributes: [
      { key: "http.method", value: { stringValue: "POST" } },
      { key: "http.status_code", value: { intValue: "200" } },
    ],
    tokensCount: 1200,
    status: "success",
    children: [
      {
        id: "span-child-001",
        title: "Database Query",
        startTime: new Date("2024-01-15T10:30:01Z"),
        endTime: new Date("2024-01-15T10:30:02Z"),
        duration: 1000,
        cost: 0.02,
        type: "retrieval",
        raw: JSON.stringify({ query: "SELECT * FROM users" }),
        attributes: [{ key: "db.operation", value: { stringValue: "SELECT" } }],
        tokensCount: 0,
        status: "success",
      },
      {
        id: "span-child-002",
        title: "LLM Processing",
        startTime: new Date("2024-01-15T10:30:02Z"),
        endTime: new Date("2024-01-15T10:30:04Z"),
        duration: 2000,
        cost: 0.08,
        type: "llm_call",
        raw: JSON.stringify({ model: "gpt-4", tokens: 800 }),
        attributes: [{ key: "llm.model", value: { stringValue: "gpt-4" } }],
        tokensCount: 800,
        status: "success",
        children: [
          {
            id: "span-grandchild-001",
            title: "Token Generation",
            startTime: new Date("2024-01-15T10:30:02.5Z"),
            endTime: new Date("2024-01-15T10:30:03.5Z"),
            duration: 1000,
            cost: 0.05,
            type: "tool_execution",
            raw: JSON.stringify({ tool: "tokenizer" }),
            attributes: [],
            tokensCount: 400,
            status: "success",
          },
        ],
      },
    ],
  },
  {
    id: "span-root-002",
    title: "Error Span",
    startTime: new Date("2024-01-15T10:30:06Z"),
    endTime: new Date("2024-01-15T10:30:07Z"),
    duration: 1000,
    cost: 0.01,
    type: "agent_invocation",
    raw: JSON.stringify({ error: "Connection timeout" }),
    attributes: [{ key: "error.type", value: { stringValue: "timeout" } }],
    tokensCount: 0,
    status: "error",
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    spans: mockSpans,
    spanCardViewOptions: {
      expandButton: "outside",
    },
    expandedSpansIds: [],
    onExpandSpansIdsChange: () => {},
  },
};

export const ExpandButton: Story = {
  args: {
    spans: mockSpans,
    spanCardViewOptions: {
      expandButton: "inside",
    },
    expandedSpansIds: [],
    onExpandSpansIdsChange: () => {},
  },
};

export const ExpandedSpans: Story = {
  args: {
    spans: mockSpans,
    spanCardViewOptions: {
      expandButton: "outside",
    },
    expandedSpansIds: ["span-root-001", "span-child-002"],
    onExpandSpansIdsChange: () => {},
  },
};

export const SelectedSpan: Story = {
  args: {
    spans: mockSpans,
    selectedSpan: mockSpans[0].children![1],
    spanCardViewOptions: {
      expandButton: "outside",
    },
    expandedSpansIds: ["span-root-001"],
    onExpandSpansIdsChange: () => {},
    onSpanSelect: (span) => console.log("Selected span:", span),
  },
};
