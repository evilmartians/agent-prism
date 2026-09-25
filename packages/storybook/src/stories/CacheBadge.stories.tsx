import type { Meta, StoryObj } from "@storybook/react-vite";

import { CacheBadge, CacheBadgeSource } from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/CacheBadge",
  component: CacheBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={CacheBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    hitRatio: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "Cache hit ratio (0–1), rendered as a percentage",
    },
  },
} satisfies Meta<typeof CacheBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hitRatio: 0.85,
  },
};
