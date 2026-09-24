import type { TraceSpan, TraceTodo } from "@evilmartians/agent-prism-types";
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
  type: "agent_invocation",
  raw: [],
  status: "success",
};

const withTodos = (todos: TraceTodo[]): TraceSpan => ({
  ...baseSpan,
  todos,
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
      { title: "Explore the codebase conventions", status: "completed" },
      { title: "Port the details-tabs helpers", status: "completed" },
      { title: "Wire the Thinking and Context tabs", status: "in_progress" },
      { title: "Add Storybook stories", status: "pending" },
      { title: "Run tsc, eslint and storybook build", status: "pending" },
    ]),
  },
};

export const AllCompleted: Story = {
  args: {
    data: withTodos([{ title: "Ship the feature", status: "completed" }]),
  },
};
