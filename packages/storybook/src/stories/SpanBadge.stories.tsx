import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpanBadge, SpanBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/SpanBadge",
  component: SpanBadge,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
  argTypes: {
    category: {
      control: { type: "select" },
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
      description: "The category of the span which avatar is associated with",
      defaultValue: "llm_call",
    },
    size: {
      control: { type: "select" },
      options: ["4", "5", "6", "7"],
      description: "The size of the badge",
      defaultValue: "5",
    },
  },
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
