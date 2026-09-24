import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewContextTab,
  DetailsViewContextTabSource,
} from "@evilmartians/agent-prism-ui";
import { Description, Primary, Source, Stories } from "@storybook/blocks";

const baseSpan: TraceSpan = {
  id: "span-context-001",
  title: "LLM call",
  startTime: new Date("2024-01-15T10:30:00Z"),
  endTime: new Date("2024-01-15T10:30:03Z"),
  type: "llm_call",
  raw: [],
  status: "success",
};

const meta = {
  title: "Details View/Context Tab",
  component: DetailsViewContextTab,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
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
        input: { tokens: 12000, cost: 0.18 },
        output: { tokens: 500, cost: 0.0375 },
        cache_read: { tokens: 140000, cost: 0.21 },
        cache_write: { tokens: 4000, cost: 0.075 },
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
