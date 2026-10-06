import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  CollapseAllButton,
  CollapseAllButtonSource,
  ExpandAllButton,
  ExpandAllButtonSource,
} from "@evilmartians/agent-prism-ui";
import {
  Controls,
  Description,
  Primary,
  Source,
  Stories,
} from "@storybook/addon-docs/blocks";

// Create a wrapper component for the meta since we have two related components
const ControlsWrapper = () => null;

const meta = {
  component: ControlsWrapper,
  parameters: {
    docs: {
      page: () => (
        <>
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <Source code={ExpandAllButtonSource} language="tsx" />
          <Source code={CollapseAllButtonSource} language="tsx" />
        </>
      ),
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Atoms/CollapseAndExpandControls",
} satisfies Meta<typeof ControlsWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExpandAll: Story = {
  render: () => (
    <ExpandAllButton onExpandAll={() => console.log("Expand all clicked")} />
  ),
};

export const CollapseAll: Story = {
  render: () => (
    <CollapseAllButton
      onCollapseAll={() => console.log("Collapse all clicked")}
    />
  ),
};

export const BothControls: Story = {
  render: () => (
    <div className="flex gap-2">
      <ExpandAllButton onExpandAll={() => console.log("Expand all clicked")} />
      <CollapseAllButton
        onCollapseAll={() => console.log("Collapse all clicked")}
      />
    </div>
  ),
};
