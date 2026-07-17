import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ErrorCountBadge,
  ErrorCountBadgeSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/ErrorCountBadge",
  component: ErrorCountBadge,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ErrorCountBadgeSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      control: { type: "number" },
      description: "The number of failed spans to display",
    },
  },
} satisfies Meta<typeof ErrorCountBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A single failed span — the label is singular ("1 error").
 */
export const SingleError: Story = {
  args: {
    count: 1,
  },
};

/**
 * Multiple failed spans in a run — the label is pluralized ("3 errors").
 */
export const MultipleErrors: Story = {
  args: {
    count: 3,
  },
};
