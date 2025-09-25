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
      options: ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"],
      description: "The size of the button",
      defaultValue: "xs",
    },
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
      description: "The color theme of the button",
      defaultValue: "gray",
    },
    rounded: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "full"],
      description: "The border radius of the button",
      defaultValue: "md",
    },
    variant: {
      control: { type: "select" },
      options: ["filled", "outlined", "ghost"],
      description: "The visual variant of the button",
      defaultValue: "filled",
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

export const Theme: Story = {
  args: {
    children: "Purple",
    theme: "purple",
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
    theme: "emerald",
  },
};

export const IconEnd: Story = {
  args: {
    children: "With Icon",
    iconEnd: <span>→</span>,
    theme: "indigo",
  },
};
