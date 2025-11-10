import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, BadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={BadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["4", "5", "6", "7"],
      description: "The size of the badge",
      defaultValue: "5",
    },
    label: {
      control: "text",
      description: "The content of the badge",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Badge",
  },
};

export const Size: Story = {
  args: {
    label: "Small",
    size: "7",
  },
};

export const IconStart: Story = {
  args: {
    label: "Start",
    iconStart: <span>✓</span>,
  },
};

export const IconEnd: Story = {
  args: {
    label: "End",
    iconEnd: <span>→</span>,
  },
};
