import type { DeepReadonly, TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpanCard, SpanCardSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";
import { expect, fn, userEvent, within } from "storybook/test";

import { llmSpan } from "../mocks/llm-span";

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
      description: "Whether this is the last child in its parent",
      table: { defaultValue: { summary: "false" } },
    },
    level: {
      control: "number",
      description: "The nesting level of the span",
      table: { defaultValue: { summary: "0" } },
    },
    selectedSpan: {
      description: "Currently selected span for highlighting",
    },
    viewOptions: {
      control: { type: "object" },
      description: "View options for the span card",
      table: {
        defaultValue: {
          summary: '{ expandButton: "outside", withStatus: true }',
        },
      },
    },
  },
  component: SpanCard,
  decorators: [
    (Story) => (
      <ul aria-label="Span cards" role="tree">
        <Story />
      </ul>
    ),
  ],
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

const llmSpanWithChildren: TraceSpan = {
  ...llmSpan,
  children: [
    {
      ...llmSpan,
      id: "span-child-001",
      status: "success",
      title: "Child Span 1",
      type: "tool_execution",
    },
    {
      ...llmSpan,
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
    data: llmSpan,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: llmSpan.endTime.getTime(),
    minStart: llmSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn<(ids: readonly string[]) => void>(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const Level: Story = {
  args: {
    data: llmSpan,
    expandedSpansIds: [],
    isLastChild: false,
    level: 2,
    maxEnd: llmSpan.endTime.getTime(),
    minStart: llmSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn<(ids: readonly string[]) => void>(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const ExpandButton: Story = {
  args: {
    data: llmSpanWithChildren,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: llmSpan.endTime.getTime(),
    minStart: llmSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn<(ids: readonly string[]) => void>(),
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
    data: llmSpan,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: llmSpan.endTime.getTime(),
    minStart: llmSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn<(ids: readonly string[]) => void>(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const SelectedSpan: Story = {
  args: {
    data: llmSpan,
    expandedSpansIds: [],
    isLastChild: false,
    maxEnd: llmSpan.endTime.getTime(),
    minStart: llmSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn<(ids: readonly string[]) => void>(),
    selectedSpan: llmSpan,
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const WithChildren: Story = {
  args: {
    data: llmSpanWithChildren,
    expandedSpansIds: ["span-parent-001"],
    isLastChild: false,
    maxEnd: llmSpan.endTime.getTime(),
    minStart: llmSpan.startTime.getTime(),
    onExpandSpansIdsChange: fn<(ids: readonly string[]) => void>(),
    viewOptions: {
      expandButton: "outside",
    },
  },
};

export const SelectsTheSpanThatWasActivated: Story = {
  args: {
    ...WithChildren.args,
    onSpanSelect: fn<(span: DeepReadonly<TraceSpan>) => void>(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [parent, child] = canvas.getAllByRole("treeitem");

    await userEvent.click(canvas.getByText("Child Span 1"));
    await expect(args.onSpanSelect).toHaveBeenCalledTimes(1);
    await expect(args.onSpanSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "span-child-001" }),
    );

    child?.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSpanSelect).toHaveBeenCalledTimes(2);

    parent?.focus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onSpanSelect).toHaveBeenLastCalledWith(
      expect.objectContaining({ id: "span-parent-001" }),
    );

    await userEvent.click(
      canvas.getByRole("button", {
        name: /Parent Span with Children children/,
      }),
    );
    await expect(args.onSpanSelect).toHaveBeenCalledTimes(3);
  },
};
