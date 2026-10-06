import type {
  TraceReasoning,
  TraceSpan,
} from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewThinkingTab,
  DetailsViewThinkingTabSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const baseSpan: TraceSpan = {
  endTime: new Date("2024-01-15T10:30:03Z"),
  id: "span-thinking-001",
  raw: [],
  startTime: new Date("2024-01-15T10:30:00Z"),
  status: "success",
  title: "Assistant message",
  type: "llm_call",
};

const withReasoning = (reasoning?: TraceReasoning): TraceSpan => ({
  ...baseSpan,
  reasoning,
});

const meta = {
  component: DetailsViewThinkingTab,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Stories />
          <Source code={DetailsViewThinkingTabSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Details View/Thinking Tab",
} satisfies Meta<typeof DetailsViewThinkingTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithThinking: Story = {
  args: {
    data: withReasoning({
      content:
        "Let me reason about the request step by step. First I need to understand the constraints, then evaluate the options, then pick the safest path.",
    }),
  },
};

export const WithMetadata: Story = {
  args: {
    data: withReasoning({
      content:
        "Considering the trade-offs between latency and accuracy before responding.",
      level: "high",
      tokens: 1280,
      triggers: ["complex reasoning", "multi-step"],
    }),
  },
};

export const TokensOnly: Story = {
  args: {
    data: withReasoning({ content: "", tokens: 512 }),
  },
  parameters: {
    docs: {
      description: {
        story: "The provider reported reasoning tokens but withheld the text.",
      },
    },
  },
};

export const Empty: Story = {
  args: {
    data: withReasoning(),
  },
};
