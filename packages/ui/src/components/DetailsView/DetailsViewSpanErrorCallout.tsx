import type { TraceSpan } from "@evilmartians/agent-prism-types";
import type { ReactElement } from "react";

import { collectSpanErrorEntry } from "@evilmartians/agent-prism-data";

import type { ReadonlyProps } from "../ReadonlyProps";

import { DetailsViewErrorEntryList } from "./DetailsViewErrorEntryList";

type DetailsViewSpanErrorCalloutProps = {
  span: TraceSpan;
};

/**
 * Renders the error for a single selected span (children excluded).
 */
export const DetailsViewSpanErrorCallout = ({
  span,
}: ReadonlyProps<DetailsViewSpanErrorCalloutProps>): null | ReactElement => {
  const entry = collectSpanErrorEntry(span);

  if (!entry) return null;

  return <DetailsViewErrorEntryList entries={[entry]} />;
};
