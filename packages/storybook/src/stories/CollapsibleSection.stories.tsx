import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  CollapsibleSection,
  CollapsibleSectionSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/addon-docs/blocks";

const meta = {
  title: "Atoms/CollapsibleSection",
  component: CollapsibleSection,
  parameters: {
    layout: "centered",
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
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: "360px",
          maxWidth: "100%",
          minHeight: "120px",
        }}
      >
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title text for the collapsible section",
    },
    children: {
      control: "text",
      description: "The content to display when expanded",
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the section is open by default",
      defaultValue: false,
    },
    className: {
      control: "text",
      description: "Optional className for the root container",
    },
    triggerClassName: {
      control: "text",
      description: "Optional className for the trigger button",
    },
    contentClassName: {
      control: "text",
      description: "Optional className for the content area",
    },
  },
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Section Title",
    children:
      "This is the collapsible content that can be expanded or collapsed.",
  },
};

export const DefaultOpen: Story = {
  args: {
    title: "Open by Default",
    children: "This section starts in an open state.",
    defaultOpen: true,
  },
};
