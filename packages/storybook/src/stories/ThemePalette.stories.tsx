import type { Meta, StoryObj } from "@storybook/react-vite";

import { ThemePalette } from "@evilmartians/agent-prism-ui";

const meta = {
  component: ThemePalette,
  parameters: {
    layout: "centered",
  },
  title: "Theme Palette",
} satisfies Meta<typeof ThemePalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
