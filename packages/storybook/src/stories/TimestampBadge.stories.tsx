import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TimestampBadge,
  TimestampBadgeSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/TimestampBadge",
  component: TimestampBadge,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
  argTypes: {
    timestamp: {
      control: { type: "number" },
      defaultValue: Date.now(),
    },
    size: {
      control: { type: "select" },
      options: ["4", "5", "6", "7"],
      description: "The size of the badge",
      defaultValue: "4",
    },
  },
} satisfies Meta<typeof TimestampBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    timestamp: Date.now(),
    size: "4",
  },
};
