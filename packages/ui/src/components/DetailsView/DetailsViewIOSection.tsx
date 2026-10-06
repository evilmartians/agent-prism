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
  section: "Input" | "Output";
  content: string;
  parsedContent: string | null;
};

export const DetailsViewIOSection = ({
  section,
  content,
  parsedContent,
}: DetailsViewIOSectionProps): ReactElement => {
  const [tab, setTab] = useState<DetailsViewContentViewMode>(
    parsedContent ? "json" : "plain",
  );

  if (tab === "json" && !parsedContent) {
    setTab("plain");
  }

  const tabItems: TabItem<DetailsViewContentViewMode>[] = [
    { value: "json", label: "JSON", disabled: !parsedContent },
    { value: "plain", label: "Plain" },
  ];

  return (
    <CollapsibleSection
      title={section}
      defaultOpen
      rightContent={
        <TabSelector<DetailsViewContentViewMode>
          items={tabItems}
          defaultValue={parsedContent ? "json" : "plain"}
          value={tab}
          onValueChange={setTab}
          theme="pill"
        />
      }
    >
      <DetailsViewContentViewer
        content={content}
        parsedContent={parsedContent}
        mode={tab}
        label={section}
        id={section}
      />
    </CollapsibleSection>
  );
};
