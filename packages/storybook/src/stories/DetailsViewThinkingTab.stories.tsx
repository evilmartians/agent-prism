import type {
  TraceSpan,
  TraceReasoning,
} from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewThinkingTab,
  DetailsViewThinkingTabSource,
} from "@evilmartians/agent-prism-ui";
import { Description, Primary, Source, Stories } from "@storybook/blocks";

const baseSpan: TraceSpan = {
  id: "span-thinking-001",
  title: "Assistant message",
  startTime: new Date("2024-01-15T10:30:00Z"),
  endTime: new Date("2024-01-15T10:30:03Z"),
  type: "llm_call",
  raw: [],
  status: "success",
};

const withReasoning = (reasoning?: TraceReasoning): TraceSpan => ({
  ...baseSpan,
  reasoning,
});

const meta = {
  title: "Details View/Thinking Tab",
  component: DetailsViewThinkingTab,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
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
      tokens: 1280,
      level: "high",
      triggers: ["complex reasoning", "multi-step"],
    }),
  },
};

/** The provider reported reasoning tokens but withheld the text. */
export const TokensOnly: Story = {
  args: {
    data: withReasoning({ content: "", tokens: 512 }),
  },
};

export const Empty: Story = {
  args: {
    data: withReasoning(),
  },
};
