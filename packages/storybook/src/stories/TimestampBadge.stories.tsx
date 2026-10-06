import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TimestampBadge,
  TimestampBadgeSource,
} from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    size: {
      control: { type: "select" },
      description: "The size of the badge",
      options: ["4", "5", "6", "7"],
      table: { defaultValue: { summary: "4" } },
    },
    timestamp: {
      control: { type: "number" },
      table: { defaultValue: { summary: "Date.now()" } },
    },
  },
  component: TimestampBadge,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={TimestampBadgeSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/TimestampBadge",
} satisfies Meta<typeof TimestampBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "4",
    timestamp: Date.now(),
  },
};
