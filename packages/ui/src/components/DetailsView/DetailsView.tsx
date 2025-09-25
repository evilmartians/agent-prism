import type { TraceSpan } from "@evilmartians/agent-prism-types";

import cn from "classnames";
import { useState, type ReactElement } from "react";

import type { AvatarProps } from "../Avatar";

import { ArrowRightLeftIcon, SquareTerminalIcon, TagsIcon } from "../icons";
import { Tabs, type TabItem } from "../Tabs";
import { DetailsViewAttributesTab } from "./DetailsViewAttributesTab";
import { DetailsViewHeader } from "./DetailsViewHeader";
import { DetailsViewInputOutputTab } from "./DetailsViewInputOutputTab";
import { DetailsViewMetrics } from "./DetailsViewMetrics";
import { DetailsViewRawDataTab } from "./DetailsViewRawDataTab";

type DetailsViewTab = "input-output" | "attributes" | "raw";

interface DetailsViewProps {
  /**
   * The span data to display in the details view
   */
  data: TraceSpan;

  /**
   * Optional avatar configuration for the header
   */
  avatar?: AvatarProps;

  /**
   * The initially selected tab
   */
  defaultTab?: DetailsViewTab;

  /**
   * Optional className for the root container
   */
  className?: string;

  /**
   * Configuration for the copy button functionality
   */
  copyButton?: {
    /**
     * Whether the copy button is enabled
     * @default false
     */
    isEnabled?: boolean;
    /**
     * Callback fired when copy button is clicked
     */
    onCopy?: (data: TraceSpan) => void;
  };

  /**
   * Callback fired when the active tab changes
   */
  onTabChange?: (tabValue: DetailsViewTab) => void;
}

export const DetailsView = ({
  data,
  avatar,
  defaultTab,
  className,
  copyButton,
  onTabChange,
}: DetailsViewProps): ReactElement => {
  const [tab, setTab] = useState<DetailsViewTab>(defaultTab || "input-output");

  const tabItems: TabItem<DetailsViewTab>[] = [
    {
      value: "input-output",
      label: "In/Out",
      icon: <ArrowRightLeftIcon className="size-4" />,
    },
    {
      value: "attributes",
      label: "Attributes",
      icon: <TagsIcon className="size-4" />,
    },
    {
      value: "raw",
      label: "RAW",
      icon: <SquareTerminalIcon className="size-4" />,
    },
  ];

  function handleTabChange(tabValue: DetailsViewTab) {
    setTab(tabValue);
    onTabChange?.(tabValue);
  }

  return (
    <div
      className={cn(
        "min-w-0 rounded border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950",
        className,
      )}
    >
      <DetailsViewHeader data={data} avatar={avatar} copyButton={copyButton} />

      <DetailsViewMetrics data={data} />

      <Tabs
        items={tabItems}
        value={tab}
        onValueChange={handleTabChange}
        theme="underline"
        defaultValue={defaultTab}
      />

      {tab === "input-output" && <DetailsViewInputOutputTab data={data} />}

      {tab === "attributes" && <DetailsViewAttributesTab data={data} />}

      {tab === "raw" && <DetailsViewRawDataTab data={data} />}
    </div>
  );
};
