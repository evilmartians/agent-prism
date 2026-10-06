import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpanCard, SpanCardSource } from "@evilmartians/agent-prism-ui";
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
    avatar: {
      description: "Optional avatar configuration",
    },
    data: {
      description: "The trace span data to display",
    },
    isLastChild: {
      control: "boolean",
      defaultValue: false,
      description: "Whether this is the last child in its parent",
    },
    level: {
      control: "number",
      defaultValue: 0,
      description: "The nesting level of the span",
    },
    selectedSpan: {
      description: "Currently selected span for highlighting",
    },
    viewOptions: {
      control: { type: "object" },
      defaultValue: {
        expandButton: "outside",
        withStatus: true,
      },
      description: "View options for the span card",
    },
  },
  component: SpanCard,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={SpanCardSource} language="tsx" />
        </>
      ),
    },
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Main Components/SpanCard",
} satisfies Meta<typeof SpanCard>;

const mockTraceSpan: TraceSpan = {
  attributes: [
    {
      key: "llm.model",
      value: { stringValue: "gpt-4" },
    },
    {
      key: "llm.temperature",
      value: { intValue: "0.7" },
    },
  ],
  endTime: new Date("2024-01-15T10:30:03Z"),
  id: "span-llm-001",
  raw: [
    JSON.stringify({
      max_tokens: 1000,
      model: "gpt-4",
      prompt: "Generate a creative story about AI",
      temperature: 0.7,
    }),
  ],
  startTime: new Date("2024-01-15T10:30:00Z"),
  status: "success",
  title: "GPT-4 Text Generation",
  tokenUsage: {
    input: { cost: 0.018, tokens: 600 },
    output: { cost: 0.027, tokens: 250 },
  },
  type: "llm_call",
};

const mockTraceSpanWithChildren: TraceSpan = {
  ...mockTraceSpan,
  children: [
    {
      ...mockTraceSpan,
      id: "span-child-001",
      status: "success",
      title: "Child Span 1",
      type: "tool_execution",
    },
    {
      ...mockTraceSpan,
      id: "span-child-002",
      status: "error",
      title: "Child Span 2",
      type: "retrieval",
    },
  ],
  id: "span-parent-001",
  title: "Parent Span with Children",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: mockTraceSpan,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: mockTraceSpan.endTime.getTime(),
    minStart: mockTraceSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const Level: Story = {
  args: {
    data: mockTraceSpan,
    expandedSpansIds: [],
    isLastChild: false,
    level: 2,
    maxEnd: mockTraceSpan.endTime.getTime(),
    minStart: mockTraceSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const ExpandButton: Story = {
  args: {
    data: mockTraceSpanWithChildren,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: mockTraceSpan.endTime.getTime(),
    minStart: mockTraceSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn(),
    viewOptions: {
      expandButton: "inside",
    },
  },
};

export const Avatar: Story = {
  args: {
    avatar: {
      alt: "LLM Service",
      category: "llm_call",
      letter: "AI",
      size: "4",
    },
    data: mockTraceSpan,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: mockTraceSpan.endTime.getTime(),
    minStart: mockTraceSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const SelectedSpan: Story = {
  args: {
    data: mockTraceSpan,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: mockTraceSpan.endTime.getTime(),
    minStart: mockTraceSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn(),
    selectedSpan: mockTraceSpan,
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const WithChildren: Story = {
  args: {
    data: mockTraceSpanWithChildren,
    expandedSpansIds: ["span-parent-001"],
    isLastChild: false,
    maxEnd: mockTraceSpan.endTime.getTime(),
    minStart: mockTraceSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};
