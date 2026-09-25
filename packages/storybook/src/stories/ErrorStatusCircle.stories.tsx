import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ErrorStatusCircle,
  ErrorStatusCircleSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

const meta = {
  title: "Atoms/ErrorStatusCircle",
  component: ErrorStatusCircle,
  parameters: {
    layout: "centered",
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
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Optional className to override the default size or color",
    },
  },
} satisfies Meta<typeof ErrorStatusCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default error glyph — a small error-accented dot placed next to failed
 * spans.
 */
export const Default: Story = {};

/**
 * The same glyph scaled up via `className`, e.g. for a standalone status marker.
 */
export const Enlarged: Story = {
  args: {
    className: "size-3",
  },
};
