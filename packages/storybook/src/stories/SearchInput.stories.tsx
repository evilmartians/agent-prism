import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchInput, SearchInputSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    disabled: {
      control: "boolean",
      defaultValue: false,
      description: "Disables the input",
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
  },
  component: SearchInput,
  parameters: {
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
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/SearchInput",
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
    disabled: true,
    id: "search-disabled",
    placeholder: "Search disabled...",
  },
};

export const NonClearable: Story = {
  args: {
    defaultValue: "search term",
    id: "search-non-clearable",
    placeholder: "No clear button...",
  },
};

export const Clearable: Story = {
  args: {
    defaultValue: "search term",
    id: "search-clearable",
    onClear: () => console.log("Clear button clicked"),
    placeholder: "Clearable input...",
  },
};
