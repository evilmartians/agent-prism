import type { ReactElement } from "react";

import { useState } from "react";

import type { ReadonlyProps } from "../ReadonlyProps";
import type { TabItem } from "../Tabs";

import { CollapsibleSection } from "../CollapsibleSection";
import { TabSelector } from "../TabSelector";
import {
  DetailsViewContentViewer,
  type DetailsViewContentViewMode,
} from "./DetailsViewContentViewer";

const TAB_ITEMS: TabItem<DetailsViewContentViewMode>[] = [
  { label: "JSON", value: "json" },
  { label: "Plain", value: "plain" },
];

type DetailsViewAttributeSectionProps = {
  attributeKey: string;
  content: string;
  id: string;
  parsedContent: unknown;
};

export const DetailsViewAttributeSection = ({
  attributeKey,
  content,
  id,
  parsedContent,
}: ReadonlyProps<DetailsViewAttributeSectionProps>): ReactElement => {
  const [tab, setTab] = useState<DetailsViewContentViewMode>("json");

  return (
    <CollapsibleSection
      defaultOpen
      rightContent={
        <TabSelector<DetailsViewContentViewMode>
          defaultValue="json"
          items={TAB_ITEMS}
          onValueChange={setTab}
          theme="pill"
          value={tab}
        />
      }
      title={attributeKey}
    >
      <DetailsViewContentViewer
        content={content}
        id={id}
        label={attributeKey}
        mode={tab}
        parsedContent={parsedContent}
      />
    </CollapsibleSection>
  );
};
