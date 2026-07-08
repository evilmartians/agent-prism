import type { TraceSpan } from "@evilmartians/agent-prism-types";
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
  duration: 3000,
  type: "llm_call",
  raw: "",
  status: "success",
  cost: 0,
  tokensCount: 0,
  attributes: [],
};

const withAttributes = (attributes: TraceSpan["attributes"]): TraceSpan => ({
  ...baseSpan,
  attributes,
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
    data: withAttributes([
      {
        key: "claude_code.thinking",
        value: {
          stringValue:
            "Let me reason about the request step by step. First I need to understand the constraints, then evaluate the options, then pick the safest path.",
        },
      },
    ]),
  },
};

export const WithMetadata: Story = {
  args: {
    data: withAttributes([
      {
        key: "claude_code.thinking",
        value: {
          stringValue:
            "Considering the trade-offs between latency and accuracy before responding.",
        },
      },
      {
        key: "claude_code.thinking_metadata",
        value: {
          stringValue: JSON.stringify({
            level: "high",
            disabled: false,
            triggers: ["complex reasoning", "multi-step"],
          }),
        },
      },
    ]),
  },
};

export const Empty: Story = {
  args: {
    data: withAttributes([]),
  },
};
