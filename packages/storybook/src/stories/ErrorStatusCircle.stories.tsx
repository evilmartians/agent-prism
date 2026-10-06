import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ErrorStatusCircle,
  ErrorStatusCircleSource,
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
    className: {
      control: "text",
      description: "Optional className to override the default size or color",
    },
  },
  component: ErrorStatusCircle,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ErrorStatusCircleSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/ErrorStatusCircle",
} satisfies Meta<typeof ErrorStatusCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The default error glyph — a small error-accented dot placed next to failed spans.",
      },
    },
  },
};

export const Enlarged: Story = {
  args: {
    className: "size-3",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The same glyph scaled up via `className`, e.g. for a standalone status marker.",
      },
    },
  },
};
