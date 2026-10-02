import type { Meta, StoryObj } from "@storybook/react-vite";

import { ModelBadge, ModelBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/ModelBadge",
  component: ModelBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ModelBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    model: {
      control: { type: "text" },
      description: "The raw model id (e.g. `claude-opus-4-8`, `gpt-4o`)",
    },
  },
} satisfies Meta<typeof ModelBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    model: "claude-opus-4-8",
  },
};

export const Claude: Story = {
  args: {
    model: "claude-3-5-sonnet-20241022",
  },
};

export const OpenAI: Story = {
  args: {
    model: "gpt-4o",
  },
};

export const Gemini: Story = {
  args: {
    model: "gemini-1.5-pro",
  },
};
