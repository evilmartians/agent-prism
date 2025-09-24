import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton, IconButtonSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={IconButtonSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "The size of the icon button",
      defaultValue: "md",
    },
    variant: {
      control: { type: "select" },
      options: ["default", "ghost"],
      description: "The visual variant of the icon button",
      defaultValue: "default",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label for screen readers (required)",
    },
    children: {
      control: "text",
      description: "Icon content (usually an icon component)",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Settings",
    children: "⚙",
  },
};

export const Size: Story = {
  args: {
    "aria-label": "Large settings button",
    children: "⚙",
    size: "lg",
  },
};

export const Variant: Story = {
  args: {
    "aria-label": "Ghost button",
    children: "✕",
    variant: "ghost",
  },
};

export const Disabled: Story = {
  args: {
    "aria-label": "Disabled button",
    children: "⚙",
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    "aria-label": "Small button",
    children: "↻",
    size: "sm",
  },
};
