import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpanBadge, SpanBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    category: {
      control: { type: "select" },
      description: "The category of the span which avatar is associated with",
      options: [
        "llm_call",
        "tool_execution",
        "agent_invocation",
        "chain_operation",
        "retrieval",
        "embedding",
        "create_agent",
        "span",
        "event",
        "guardrail",
        "unknown",
      ],
      table: { defaultValue: { summary: "llm_call" } },
    },
    size: {
      control: { type: "select" },
      description: "The size of the badge",
      options: ["4", "5", "6", "7"],
      table: { defaultValue: { summary: "5" } },
    },
  },
  component: SpanBadge,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={SpanBadgeSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/SpanBadge",
} satisfies Meta<typeof SpanBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: "llm_call",
  },
};

export const Size: Story = {
  args: {
    category: "llm_call",
    size: "7",
  },
};
