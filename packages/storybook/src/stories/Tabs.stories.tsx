import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/addon-docs/blocks";

const meta = {
  title: "Atoms/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
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
  },
  decorators: [
    (Story) => (
      <div style={{ width: "360px", maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
  argTypes: {
    items: {
      description: "Array of tab items to display",
    },
    defaultValue: {
      control: "text",
      description: "The initially selected tab value (uncontrolled)",
    },
    theme: {
      control: { type: "select" },
      options: ["underline", "pill"],
      description: "Visual theme variant for the tabs",
    },
  },
} satisfies Meta<typeof Tabs>;

const mockTabItems = [
  {
    value: "tab1",
    label: "First Tab",
    content: <div className="p-4">Content of the first tab</div>,
  },
  {
    value: "tab2",
    label: "Second Tab",
    content: <div className="p-4">Content of the second tab</div>,
  },
  {
    value: "tab3",
    label: "Third Tab",
    content: <div className="p-4">Content of the third tab</div>,
  },
];

const tabItemsWithIcons = [
  {
    value: "settings",
    label: "Settings",
    icon: <span>⚙</span>,
    content: <div className="p-4">Settings panel content</div>,
  },
  {
    value: "profile",
    label: "Profile",
    icon: <span>👤</span>,
    content: <div className="p-4">Profile information content</div>,
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: <span>🔔</span>,
    content: <div className="p-4">Notifications settings</div>,
    disabled: true,
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
    items: mockTabItems,
    defaultValue: "tab2",
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
