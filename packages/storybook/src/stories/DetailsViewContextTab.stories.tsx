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

const fullContextSpan: TraceSpan = {
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
};

export const FullContext: Story = {
  args: {
    data: fullContextSpan,
  },
};

const contextItems: TraceSpan["context"] = [
  {
    type: "hook_success",
    title: "Hook succeeded: SessionStart:startup",
    content: "Project memory loaded.\nBranch: main",
    timestamp: new Date("2024-01-15T10:29:58Z"),
    metadata: { hookEvent: "SessionStart", exitCode: 0, durationMs: 212 },
  },
  {
    type: "skill_listing",
    title: "Skill listing",
    content: Array.from(
      { length: 40 },
      (_, index) => `- skill-${index + 1}: what the skill is for`,
    ).join("\n"),
    timestamp: new Date("2024-01-15T10:30:00Z"),
    metadata: { skillCount: 40, isInitial: true },
  },
  {
    type: "plan_mode",
    title: "Plan mode",
    timestamp: new Date("2024-01-15T10:30:00Z"),
    metadata: { reminderType: "full", planExists: false },
  },
  {
    type: "interrupt",
    title: "Request interrupted by user",
    content: "[Request interrupted by user]",
  },
];

export const WithContextItems: Story = {
  args: {
    data: {
      ...fullContextSpan,
      context: contextItems,
    },
  },
};

export const ContextItemsOnly: Story = {
  args: {
    data: {
      ...baseSpan,
      title: "Edit parse.ts",
      type: "tool_execution",
      context: [
        {
          type: "hook_blocking_error",
          title: "Hook blocked: PostToolUse:Edit",
          content:
            "Quality gate: pnpm typecheck failed after edit to src/parse.ts",
          timestamp: new Date("2024-01-15T10:30:02Z"),
          metadata: { hookEvent: "PostToolUse", command: "quality-gates.sh" },
        },
      ],
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
