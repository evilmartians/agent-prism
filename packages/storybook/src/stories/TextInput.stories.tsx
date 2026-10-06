import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  TextInput,
  type TextInputProps,
  TextInputSource,
} from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";
import { useState } from "react";

const ClearableTextInput = (args: TextInputProps) => {
  const [value, setValue] = useState(args.defaultValue);

  return (
    <TextInput
      {...args}
      onClear={() => {
        setValue("");
      }}
      onValueChange={setValue}
      value={value}
    />
  );
};

const meta = {
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the input",
      table: { defaultValue: { summary: "false" } },
    },
    hideLabel: {
      control: "boolean",
      description:
        "Whether to visually hide the label while keeping it for screen readers",
      table: { defaultValue: { summary: "false" } },
    },
    id: {
      control: "text",
      description: "Unique identifier for the input (required)",
    },
    label: {
      control: "text",
      description: "Label text for the input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    startIcon: {
      description: "Icon to display at the start of the input",
    },
  },
  component: TextInput,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={TextInputSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/TextInput",
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "default-input",
    placeholder: "Enter text...",
  },
};

export const Label: Story = {
  args: {
    id: "labeled-input",
    label: "Username",
    placeholder: "Enter username...",
  },
};

export const HideLabel: Story = {
  args: {
    hideLabel: true,
    id: "hidden-label-input",
    label: "Search",
    placeholder: "Search...",
  },
};

export const Clearable: Story = {
  args: {
    defaultValue: "example@domain.com",
    id: "clearable-input",
    label: "Email",
    placeholder: "Enter email...",
  },
  render: (args: TextInputProps) => <ClearableTextInput {...args} />,
};

export const StartIcon: Story = {
  args: {
    id: "icon-input",
    label: "Search",
    placeholder: "Search...",
    startIcon: <span>🔍</span>,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: "Disabled value",
    disabled: true,
    id: "disabled-input",
    label: "Disabled Field",
    placeholder: "Cannot type here...",
  },
};
