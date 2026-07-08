import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DetailsViewImagesTab,
  DetailsViewImagesTabSource,
} from "@evilmartians/agent-prism-ui";
import {
  Description,
  Primary,
  Controls,
  Stories,
  Source,
} from "@storybook/blocks";

// A 1x1 transparent PNG — renders as a real (tiny) image in the gallery.
const PIXEL_PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const baseSpan = (overrides: Partial<TraceSpan>): TraceSpan => ({
  id: "span-images-001",
  title: "Image-bearing span",
  startTime: new Date("2024-01-15T10:30:00Z"),
  endTime: new Date("2024-01-15T10:30:03Z"),
  duration: 3000,
  type: "tool_execution",
  raw: "{}",
  status: "success",
  ...overrides,
});

const meta = {
  title: "Main Components/DetailsViewImagesTab",
  component: DetailsViewImagesTab,
  parameters: {
    layout: "centered",
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={DetailsViewImagesTabSource} language="tsx" />
        </>
      ),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description:
        "The span whose input/output/attributes are scanned for images",
    },
  },
} satisfies Meta<typeof DetailsViewImagesTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputAndOutputImages: Story = {
  args: {
    data: baseSpan({
      input:
        "Please analyze the screenshot at /uploads/screenshot.png and /uploads/diagram.jpg",
      output: "Generated chart saved to /results/chart.png",
    }),
  },
};

export const AttributeImages: Story = {
  args: {
    data: baseSpan({
      attributes: [
        {
          key: "claude_code.images",
          value: { stringValue: JSON.stringify([PIXEL_PNG]) },
        },
      ],
    }),
  },
};

export const NoImages: Story = {
  args: {
    data: baseSpan({ input: "plain text prompt", output: "plain text answer" }),
  },
};
