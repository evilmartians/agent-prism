import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsSource } from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

const meta = {
  argTypes: {
    defaultValue: {
      control: "text",
      description: "The initially selected tab value (uncontrolled)",
    },
    items: {
      description: "Array of tab items to display",
    },
    theme: {
      control: { type: "select" },
      description: "Visual theme variant for the tabs",
      options: ["underline", "pill"],
    },
  },
  component: Tabs,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "100%", width: "360px" }}>
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
          <Source code={TabsSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/Tabs",
} satisfies Meta<typeof Tabs>;

const mockTabItems = [
  {
    content: <div className="p-4">Content of the first tab</div>,
    label: "First Tab",
    value: "tab1",
  },
  {
    content: <div className="p-4">Content of the second tab</div>,
    label: "Second Tab",
    value: "tab2",
  },
  {
    content: <div className="p-4">Content of the third tab</div>,
    label: "Third Tab",
    value: "tab3",
  },
];

const tabItemsWithIcons = [
  {
    content: <div className="p-4">Settings panel content</div>,
    icon: <span>⚙</span>,
    label: "Settings",
    value: "settings",
  },
  {
    content: <div className="p-4">Profile information content</div>,
    icon: <span>👤</span>,
    label: "Profile",
    value: "profile",
  },
  {
    content: <div className="p-4">Notifications settings</div>,
    disabled: true,
    icon: <span>🔔</span>,
    label: "Notifications",
    value: "notifications",
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: mockTabItems,
  },
};

export const DefaultValue: Story = {
  args: {
    defaultValue: "tab2",
    items: mockTabItems,
  },
};

export const Theme: Story = {
  args: {
    items: mockTabItems,
    theme: "pill",
  },
};

export const WithIcons: Story = {
  args: {
    items: tabItemsWithIcons,
  },
};
