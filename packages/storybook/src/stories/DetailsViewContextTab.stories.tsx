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
  duration: 3000,
  type: "llm_call",
  raw: "",
  status: "success",
  cost: 0.045,
  tokensCount: 12500,
  attributes: [],
};

const withAttributes = (attributes: TraceSpan["attributes"]): TraceSpan => ({
  ...baseSpan,
  attributes,
});

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
    data: withAttributes([
      { key: "gen_ai.request.model", value: { stringValue: "claude-opus-4" } },
      { key: "claude_code.usage.speed", value: { stringValue: "fast" } },
      { key: "claude_code.cumulative_tokens", value: { intValue: "156000" } },
      { key: "claude_code.context_limit", value: { intValue: "200000" } },
      {
        key: "claude_code.context_fill_percent",
        value: { stringValue: "78.00" },
      },
      { key: "claude_code.cache_hit_ratio", value: { stringValue: "0.94" } },
      { key: "gen_ai.usage.input_tokens", value: { intValue: "12000" } },
      { key: "gen_ai.usage.output_tokens", value: { intValue: "500" } },
      {
        key: "gen_ai.usage.cache_read_input_tokens",
        value: { intValue: "140000" },
      },
      {
        key: "gen_ai.usage.cache_creation_input_tokens",
        value: { intValue: "4000" },
      },
    ]),
  },
};

export const TokenBreakdownOnly: Story = {
  args: {
    data: withAttributes([
      { key: "gen_ai.usage.input_tokens", value: { intValue: "1200" } },
      { key: "gen_ai.usage.output_tokens", value: { intValue: "340" } },
    ]),
  },
};

export const Empty: Story = {
  args: {
    data: withAttributes([]),
  },
};
