import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewContextTab,
  DetailsViewContextTabSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const baseSpan: TraceSpan = {
  endTime: new Date("2024-01-15T10:30:03Z"),
  id: "span-context-001",
  raw: [],
  startTime: new Date("2024-01-15T10:30:00Z"),
  status: "success",
  title: "LLM call",
  type: "llm_call",
};

const meta = {
  component: DetailsViewContextTab,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Stories />
          <Source code={DetailsViewContextTabSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Details View/Context Tab",
} satisfies Meta<typeof DetailsViewContextTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullContext: Story = {
  args: {
    data: {
      ...baseSpan,
      attributes: [
        {
          key: "gen_ai.request.model",
          value: { stringValue: "claude-opus-4" },
        },
        { key: "claude_code.usage.speed", value: { stringValue: "fast" } },
        {
          key: "claude_code.cumulative_tokens",
          value: { intValue: "156000" },
        },
        { key: "claude_code.context_limit", value: { intValue: "200000" } },
        {
          key: "claude_code.context_fill_percent",
          value: { stringValue: "78.00" },
        },
        {
          key: "claude_code.cache_hit_ratio",
          value: { stringValue: "0.94" },
        },
      ],
      tokenUsage: {
        cache_read: { cost: 0.21, tokens: 140000 },
        cache_write: { cost: 0.075, tokens: 4000 },
        input: { cost: 0.18, tokens: 12000 },
        output: { cost: 0.0375, tokens: 500 },
      },
    },
  },
};

export const TokenBreakdownOnly: Story = {
  args: {
    data: {
      ...baseSpan,
      tokenUsage: {
        input: { tokens: 1200 },
        output: { tokens: 340 },
      },
    },
  },
};

export const Empty: Story = {
  args: {
    data: baseSpan,
  },
};
