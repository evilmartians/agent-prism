import type { ReactElement } from "react";

import { useState } from "react";

import type { TabItem } from "../Tabs";

import { CollapsibleSection } from "../CollapsibleSection";
import { TabSelector } from "../TabSelector";
import {
  DetailsViewContentViewer,
  type DetailsViewContentViewMode,
} from "./DetailsViewContentViewer";

type DetailsViewIOSectionProps = {
  content: string;
  parsedContent: null | string;
  section: "Input" | "Output";
};

export const DetailsViewIOSection = ({
  content,
  parsedContent,
  section,
}: DetailsViewIOSectionProps): ReactElement => {
  const [tab, setTab] = useState<DetailsViewContentViewMode>(
    parsedContent ? "json" : "plain",
  );

  if (tab === "json" && !parsedContent) {
    setTab("plain");
  }

  const tabItems: TabItem<DetailsViewContentViewMode>[] = [
    { disabled: !parsedContent, label: "JSON", value: "json" },
    { label: "Plain", value: "plain" },
  ];

  return (
    <CollapsibleSection
      defaultOpen
      rightContent={
        <TabSelector<DetailsViewContentViewMode>
          defaultValue={parsedContent ? "json" : "plain"}
          items={tabItems}
          onValueChange={setTab}
          theme="pill"
          value={tab}
        />
      }
      title={section}
    >
      <DetailsViewContentViewer
        content={content}
        id={section}
        label={section}
        mode={tab}
        parsedContent={parsedContent}
      />
    </CollapsibleSection>
  );
};
