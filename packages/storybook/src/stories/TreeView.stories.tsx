import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TreeView, TreeViewSource } from "@evilmartians/agent-prism-ui";
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
      description: "Optional className for the tree container",
    },
    expandedSpansIds: {
      description: "Array of span IDs that are currently expanded",
    },
    selectedSpan: {
      description: "Currently selected span for highlighting",
    },
    spanCardViewOptions: {
      control: { type: "object" },
      description: "View options for the span card",
      table: {
        defaultValue: {
          summary: '{ expandButton: "outside", withStatus: true }',
        },
      },
    },
    spans: {
      description:
        "Array of root-level trace spans to display in tree structure",
    },
  },
  component: TreeView,
  parameters: {
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
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Main Components/TreeView",
} satisfies Meta<typeof TreeView>;

const llmProcessingSpan: TraceSpan = {
  attributes: [{ key: "llm.model", value: { stringValue: "gpt-4" } }],
  children: [
    {
      attributes: [],
      endTime: new Date("2024-01-15T10:30:03.5Z"),
      id: "span-grandchild-001",
      raw: [JSON.stringify({ tool: "tokenizer" })],
      startTime: new Date("2024-01-15T10:30:02.5Z"),
      status: "success",
      title: "Token Generation",
      tokenUsage: { total: { cost: 0.05, tokens: 400 } },
      type: "tool_execution",
    },
  ],
  endTime: new Date("2024-01-15T10:30:04Z"),
  id: "span-child-002",
  raw: [JSON.stringify({ model: "gpt-4", tokens: 800 })],
  startTime: new Date("2024-01-15T10:30:02Z"),
  status: "success",
  title: "LLM Processing",
  tokenUsage: { total: { cost: 0.08, tokens: 800 } },
  type: "llm_call",
};

const mockSpans: TraceSpan[] = [
  {
    attributes: [
      { key: "http.method", value: { stringValue: "POST" } },
      { key: "http.status_code", value: { intValue: "200" } },
    ],
    children: [
      {
        attributes: [{ key: "db.operation", value: { stringValue: "SELECT" } }],
        endTime: new Date("2024-01-15T10:30:02Z"),
        id: "span-child-001",
        raw: [JSON.stringify({ query: "SELECT * FROM users" })],
        startTime: new Date("2024-01-15T10:30:01Z"),
        status: "success",
        title: "Database Query",
        tokenUsage: { total: { cost: 0.02, tokens: 0 } },
        type: "retrieval",
      },
      llmProcessingSpan,
    ],
    endTime: new Date("2024-01-15T10:30:05Z"),
    id: "span-root-001",
    raw: [JSON.stringify({ endpoint: "/api/process" })],
    startTime: new Date("2024-01-15T10:30:00Z"),
    status: "success",
    title: "Root Span - API Request",
    tokenUsage: { total: { cost: 0.12, tokens: 1200 } },
    type: "llm_call",
  },
  {
    attributes: [{ key: "error.type", value: { stringValue: "timeout" } }],
    endTime: new Date("2024-01-15T10:30:07Z"),
    id: "span-root-002",
    raw: [JSON.stringify({ error: "Connection timeout" })],
    startTime: new Date("2024-01-15T10:30:06Z"),
    status: "error",
    title: "Error Span",
    tokenUsage: { total: { cost: 0.01, tokens: 0 } },
    type: "agent_invocation",
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    expandedSpansIds: [],
    onExpandSpansIdsChange: fn<(ids: string[]) => void>(),
    spanCardViewOptions: {
      expandButton: "outside",
    },
    spans: mockSpans,
  },
};

export const ExpandButton: Story = {
  args: {
    expandedSpansIds: [],
    onExpandSpansIdsChange: fn<(ids: string[]) => void>(),
    spanCardViewOptions: {
      expandButton: "inside",
    },
    spans: mockSpans,
  },
};

export const ExpandedSpans: Story = {
  args: {
    expandedSpansIds: ["span-root-001", "span-child-002"],
    onExpandSpansIdsChange: fn<(ids: string[]) => void>(),
    spanCardViewOptions: {
      expandButton: "outside",
    },
    spans: mockSpans,
  },
};

export const SelectedSpan: Story = {
  args: {
    expandedSpansIds: ["span-root-001"],
    onExpandSpansIdsChange: fn<(ids: string[]) => void>(),
    onSpanSelect: (span) => {
      console.log("Selected span:", span);
    },
    selectedSpan: llmProcessingSpan,
    spanCardViewOptions: {
      expandButton: "outside",
    },
    spans: mockSpans,
  },
};
