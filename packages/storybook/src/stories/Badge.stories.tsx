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
    theme: {
      control: { type: "select" },
      options: [
        "gray",
        "red",
        "orange",
        "yellow",
        "teal",
        "indigo",
        "purple",
        "sky",
        "cyan",
        "emerald",
      ],
      description: "The color theme of the badge",
      defaultValue: "gray",
    },
    variant: {
      control: { type: "select" },
      options: ["solid", "outline"],
      description: "The visual variant of the badge",
      defaultValue: "solid",
    },
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md"],
      description: "The size of the badge",
      defaultValue: "md",
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
    theme: "gray",
  },
};

export const Size: Story = {
  args: {
    label: "Small",
    theme: "indigo",
    size: "sm",
  },
};

export const Variant: Story = {
  args: {
    label: "Outline",
    theme: "indigo",
    variant: "outline",
  },
};

export const Theme: Story = {
  args: {
    label: "Red",
    theme: "red",
  },
};

export const IconStart: Story = {
  args: {
    label: "Start",
    theme: "emerald",
    iconStart: <span>✓</span>,
  },
};

export const IconEnd: Story = {
  args: {
    label: "End",
    theme: "orange",
    iconEnd: <span>→</span>,
  },
};
