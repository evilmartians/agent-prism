import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    children: {
      control: "text",
      description: "The content of the button",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
      table: { defaultValue: { summary: "false" } },
    },
    fullWidth: {
      control: "boolean",
      description: "Makes the button full width",
      table: { defaultValue: { summary: "false" } },
    },
    rounded: {
      control: { type: "select" },
      description: "The border radius of the button",
      options: ["none", "sm", "md", "lg", "full"],
      table: { defaultValue: { summary: "md" } },
    },
    size: {
      control: { type: "select" },
      description: "The size of the button",
      options: ["6", "7", "8", "9", "10", "11", "12", "16"],
      table: { defaultValue: { summary: "8" } },
    },
    type: {
      control: { type: "select" },
      description: "The button type attribute",
      options: ["button", "submit", "reset"],
      table: { defaultValue: { summary: "button" } },
    },
    variant: {
      control: { type: "select" },
      description: "The visual variant of the button",
      options: [
        "brand",
        "primary",
        "outlined",
        "secondary",
        "ghost",
        "destructive",
        "success",
      ],
      table: { defaultValue: { summary: "primary" } },
    },
  },
  component: Button,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ButtonSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/Button",
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Variant: Story = {
  args: {
    children: "Outlined",
    variant: "outlined",
  },
};

export const Rounded: Story = {
  args: {
    children: "Full Rounded",
    rounded: "full",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const IconStart: Story = {
  args: {
    children: "With Icon",
    iconStart: <span>✓</span>,
  },
};

export const IconEnd: Story = {
  args: {
    children: "With Icon",
    iconEnd: <span>→</span>,
  },
};
