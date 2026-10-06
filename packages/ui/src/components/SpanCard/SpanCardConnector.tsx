import type { ReactElement } from "react";

export type SpanCardConnectorType =
  | "corner-top-right"
  | "empty"
  | "horizontal"
  | "t-right"
  | "vertical";

type SpanCardConnectorProps = {
  type: SpanCardConnectorType;
};

export const SpanCardConnector = ({
  type,
}: SpanCardConnectorProps): ReactElement => {
  if (type === "empty") return <div className="w-5 shrink-0 grow" />;

  return (
    <div className="relative w-5 shrink-0 grow">
      {(type === "vertical" || type === "t-right") && (
        <div className="bg-agentprism-secondary absolute inset-y-0 left-1/2 z-10 w-0.5 -translate-x-1/2" />
      )}

      {type === "t-right" && (
        <div className="bg-agentprism-secondary absolute left-2.5 top-2.5 h-0.5 w-2.5 translate-y-[-3px]" />
      )}

      {type === "corner-top-right" && (
        <>
          <div className="bg-agentprism-secondary absolute left-1/2 top-2 size-0.5 -translate-x-1/2 -translate-y-px" />

          <div className="bg-agentprism-secondary absolute left-1/2 top-2.5 h-0.5 w-2.5 translate-y-[-3px]" />

          <div className="bg-agentprism-secondary absolute left-1/2 top-0 h-[7px] w-0.5 -translate-x-px" />
        </>
      )}
    </div>
  );
};
