import type { RunErrorEntry } from "@evilmartians/agent-prism-data";
import type { ReactElement } from "react";

import { DetailsViewErrorRunRow } from "./DetailsViewErrorRunRow";

type DetailsViewErrorEntryListProps = {
  entries: RunErrorEntry[];
};

/**
 * Vertical stack of {@link DetailsViewErrorRunRow}; renders nothing when empty.
 */
export const DetailsViewErrorEntryList = ({
  entries,
}: DetailsViewErrorEntryListProps): null | ReactElement => {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <DetailsViewErrorRunRow entry={entry} key={entry.span.id} />
      ))}
    </div>
  );
};
