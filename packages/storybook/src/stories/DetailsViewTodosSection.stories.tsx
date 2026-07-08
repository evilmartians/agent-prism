import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewTodosSection,
  DetailsViewTodosSectionSource,
} from "@evilmartians/agent-prism-ui";
import { Description, Primary, Source, Stories } from "@storybook/blocks";

const baseSpan: TraceSpan = {
  id: "span-todos-001",
  title: "Agent turn",
  startTime: new Date("2024-01-15T10:30:00Z"),
  endTime: new Date("2024-01-15T10:30:03Z"),
  duration: 3000,
  type: "agent_invocation",
  raw: "",
  status: "success",
  cost: 0,
  tokensCount: 0,
  attributes: [],
};

const withTodos = (
  todos: Array<{ content: string; status: string; activeForm: string }>,
): TraceSpan => ({
  ...baseSpan,
  attributes: [
    { key: "claude_code.todos", value: { stringValue: JSON.stringify(todos) } },
  ],
});

const meta = {
  title: "Details View/Todos Section",
  component: DetailsViewTodosSection,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Stories />
          <Source code={DetailsViewTodosSectionSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DetailsViewTodosSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MixedStatuses: Story = {
  args: {
    data: withTodos([
      {
        content: "Explore the codebase conventions",
        status: "completed",
        activeForm: "Exploring the codebase conventions",
      },
      {
        content: "Port the details-tabs helpers",
        status: "completed",
        activeForm: "Porting the details-tabs helpers",
      },
      {
        content: "Wire the Thinking and Context tabs",
        status: "in_progress",
        activeForm: "Wiring the Thinking and Context tabs",
      },
      {
        content: "Add Storybook stories",
        status: "pending",
        activeForm: "Adding Storybook stories",
      },
      {
        content: "Run tsc, eslint and storybook build",
        status: "pending",
        activeForm: "Running tsc, eslint and storybook build",
      },
    ]),
  },
};

export const AllCompleted: Story = {
  args: {
    data: withTodos([
      {
        content: "Ship the feature",
        status: "completed",
        activeForm: "Shipping the feature",
      },
    ]),
  },
};
