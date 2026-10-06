import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge, BadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    label: {
      control: "text",
      description: "The content of the badge",
    },
    size: {
      control: { type: "select" },
      defaultValue: "5",
      description: "The size of the badge",
      options: ["4", "5", "6", "7"],
    },
  },
  component: Badge,
  parameters: {
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
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/Badge",
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
    iconStart: <span>✓</span>,
    label: "Start",
  },
};

export const IconEnd: Story = {
  args: {
    iconEnd: <span>→</span>,
    label: "End",
  },
};
