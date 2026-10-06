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
      defaultValue: false,
      description: "Disables the button",
    },
    fullWidth: {
      control: "boolean",
      defaultValue: false,
      description: "Makes the button full width",
    },
    rounded: {
      control: { type: "select" },
      defaultValue: "md",
      description: "The border radius of the button",
      options: ["none", "sm", "md", "lg", "full"],
    },
    size: {
      control: { type: "select" },
      defaultValue: "8",
      description: "The size of the button",
      options: ["6", "7", "8", "9", "10", "11", "12", "16"],
    },
    type: {
      control: { type: "select" },
      defaultValue: "button",
      description: "The button type attribute",
      options: ["button", "submit", "reset"],
    },
    variant: {
      control: { type: "select" },
      defaultValue: "primary",
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
