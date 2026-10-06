import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  CollapsibleSection,
  CollapsibleSectionSource,
} from "@evilmartians/agent-prism-ui";
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
      description: "The content to display when expanded",
    },
    className: {
      control: "text",
      description: "Optional className for the root container",
    },
    contentClassName: {
      control: "text",
      description: "Optional className for the content area",
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the section is open by default",
      table: { defaultValue: { summary: "false" } },
    },
    title: {
      control: "text",
      description: "The title text for the collapsible section",
    },
    triggerClassName: {
      control: "text",
      description: "Optional className for the trigger button",
    },
  },
  component: CollapsibleSection,
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: "100%",
          minHeight: "120px",
          width: "360px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={CollapsibleSectionSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/CollapsibleSection",
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      "This is the collapsible content that can be expanded or collapsed.",
    title: "Section Title",
  },
};

export const DefaultOpen: Story = {
  args: {
    children: "This section starts in an open state.",
    defaultOpen: true,
    title: "Open by Default",
  },
};
