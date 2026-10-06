import type { ReactElement } from "react";

import { useState } from "react";

import type { TabItem } from "../Tabs";

import { CollapsibleSection } from "../CollapsibleSection";
import { TabSelector } from "../TabSelector";
import {
  DetailsViewContentViewer,
  type DetailsViewContentViewMode,
} from "./DetailsViewContentViewer";

const TAB_ITEMS: TabItem<DetailsViewContentViewMode>[] = [
  { value: "json", label: "JSON" },
  { value: "plain", label: "Plain" },
];

type DetailsViewAttributeSectionProps = {
  attributeKey: string;
  content: string;
  parsedContent: string;
  id: string;
};

export const DetailsViewAttributeSection = ({
  attributeKey,
  content,
  parsedContent,
  id,
}: DetailsViewAttributeSectionProps): ReactElement => {
  const [tab, setTab] = useState<DetailsViewContentViewMode>("json");

  return (
    <CollapsibleSection
      title={attributeKey}
      defaultOpen
      rightContent={
        <TabSelector<DetailsViewContentViewMode>
          items={TAB_ITEMS}
          defaultValue="json"
          value={tab}
          onValueChange={setTab}
          theme="pill"
          onClick={(event) => event.stopPropagation()}
        />
      }
    >
      <DetailsViewContentViewer
        content={content}
        parsedContent={parsedContent}
        mode={tab}
        label={attributeKey}
        id={id}
      />
    </CollapsibleSection>
  );
};
