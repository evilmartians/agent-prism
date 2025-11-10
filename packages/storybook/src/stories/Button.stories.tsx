import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, ButtonSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The content of the button",
    },
    size: {
      control: { type: "select" },
      options: ["6", "7", "8", "9", "10", "11", "12", "16"],
      description: "The size of the button",
      defaultValue: "8",
    },
    rounded: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "full"],
      description: "The border radius of the button",
      defaultValue: "md",
    },
    variant: {
      control: { type: "select" },
      options: [
        "brand",
        "primary",
        "outlined",
        "secondary",
        "ghost",
        "destructive",
        "success",
      ],
      description: "The visual variant of the button",
      defaultValue: "primary",
    },
    fullWidth: {
      control: "boolean",
      description: "Makes the button full width",
      defaultValue: false,
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
      defaultValue: false,
    },
    type: {
      control: { type: "select" },
      options: ["button", "submit", "reset"],
      description: "The button type attribute",
      defaultValue: "button",
    },
  },
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
