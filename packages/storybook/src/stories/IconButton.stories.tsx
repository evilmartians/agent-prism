import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconButton, IconButtonSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
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
      table: { defaultValue: { summary: "false" } },
    },
    size: {
      control: { type: "select" },
      description: "The size of the icon button",
      options: ["6", "7", "8", "9", "10", "11", "12", "16"],
      table: { defaultValue: { summary: "8" } },
    },
    variant: {
      control: { type: "select" },
      description: "The visual variant of the icon button",
      options: ["default", "ghost"],
      table: { defaultValue: { summary: "default" } },
    },
  },
  component: IconButton,
  parameters: {
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
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/IconButton",
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
    size: "16",
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
    size: "6",
  },
};
