import type { TraceSpan, TraceTodo } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewTodosSection,
  DetailsViewTodosSectionSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const baseSpan: TraceSpan = {
  endTime: new Date("2024-01-15T10:30:03Z"),
  id: "span-todos-001",
  raw: [],
  startTime: new Date("2024-01-15T10:30:00Z"),
  status: "success",
  title: "Agent turn",
  type: "agent_invocation",
};

const withTodos = (todos: TraceTodo[]): TraceSpan => ({
  ...baseSpan,
  todos,
});

const meta = {
  component: DetailsViewTodosSection,
  parameters: {
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
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Details View/Todos Section",
} satisfies Meta<typeof DetailsViewTodosSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MixedStatuses: Story = {
  args: {
    data: withTodos([
      { status: "completed", title: "Explore the codebase conventions" },
      { status: "completed", title: "Port the details-tabs helpers" },
      { status: "in_progress", title: "Wire the Thinking and Context tabs" },
      { status: "pending", title: "Add Storybook stories" },
      { status: "pending", title: "Run tsc, eslint and storybook build" },
    ]),
  },
};

export const AllCompleted: Story = {
  args: {
    data: withTodos([{ status: "completed", title: "Ship the feature" }]),
  },
};
