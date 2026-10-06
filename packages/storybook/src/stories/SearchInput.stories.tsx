import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchInput, SearchInputSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/addon-docs/blocks";

const meta = {
  title: "Atoms/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={SearchInputSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
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
    disabled: {
      control: "boolean",
      description: "Disables the input",
      defaultValue: false,
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "search-default",
  },
};

export const Placeholder: Story = {
  args: {
    id: "search-placeholder",
    placeholder: "Search traces...",
  },
};

export const Label: Story = {
  args: {
    id: "search-labeled",
    label: "Search",
    placeholder: "Enter search term...",
  },
};

export const Disabled: Story = {
  args: {
    id: "search-disabled",
    placeholder: "Search disabled...",
    disabled: true,
  },
};

export const NonClearable: Story = {
  args: {
    id: "search-non-clearable",
    placeholder: "No clear button...",
    defaultValue: "search term",
  },
};

export const Clearable: Story = {
  args: {
    id: "search-clearable",
    placeholder: "Clearable input...",
    onClear: () => console.log("Clear button clicked"),
    defaultValue: "search term",
  },
};
