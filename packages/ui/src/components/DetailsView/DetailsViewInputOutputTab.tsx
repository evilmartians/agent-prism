import type { TraceSpan } from "@evilmartians/agent-prism-types";

import { Check, Copy } from "lucide-react";
import { useState, type ReactElement } from "react";
import JSONPretty from "react-json-pretty";
import colors from "tailwindcss/colors";

import { CollapsibleSection } from "../CollapsibleSection";
import { IconButton } from "../IconButton";
import { Tabs, type TabItem } from "../Tabs";

interface DetailsViewInputOutputTabProps {
  data: TraceSpan;
}

type IOTab = "json" | "plain";

type IOSection = "Input" | "Output";

export const DetailsViewInputOutputTab = ({
  data,
}: DetailsViewInputOutputTabProps): ReactElement => {
  const hasInput = Boolean(data.input);
  const hasOutput = Boolean(data.output);

  if (!hasInput && !hasOutput) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No input or output data available for this span.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {typeof data.input === "string" && (
        <IOSection section="Input" content={data.input} />
      )}

      {typeof data.output === "string" && (
        <IOSection section="Output" content={data.output} />
      )}
    </div>
  );
};

interface IOSectionProps {
  section: IOSection;
  content: string;
}

const IOSection = ({ section, content }: IOSectionProps): ReactElement => {
  const [tab, setTab] = useState<IOTab>("json");
  const [open, setOpen] = useState(true);

  let parsedData: string | null = null;

  try {
    parsedData = JSON.parse(content);
  } catch {
    parsedData = null;
  }

  const tabItems: TabItem<IOTab>[] = [
    {
      value: "json",
      label: "JSON",
      disabled: !parsedData,
    },
    {
      value: "plain",
      label: "Plain",
    },
  ];

  return (
    <CollapsibleSection
      title={section}
      defaultOpen
      onOpenChange={setOpen}
      rightContent={
        open ? (
          <Tabs<IOTab>
            items={tabItems}
            defaultValue={parsedData ? "json" : "plain"}
            value={tab}
            onValueChange={setTab}
            theme="pill"
            onClick={(event) => event.stopPropagation()}
          />
        ) : null
      }
      triggerClassName="min-h-16"
    >
      <IOContent
        content={content}
        section={section}
        tab={tab}
        parsedData={parsedData}
      />
    </CollapsibleSection>
  );
};

interface IOContentProps extends Omit<IOSectionProps, "title"> {
  tab: IOTab;
  parsedData: string | null;
}

const IOContent = ({
  tab,
  content,
  section,
  parsedData,
}: IOContentProps): ReactElement => {
  if (!content) {
    return (
      <p className="p-3 text-sm italic text-gray-500 dark:text-gray-400">
        No data available
      </p>
    );
  }

  return (
    <div className="relative rounded-lg border border-gray-200 dark:border-gray-800">
      <CopyButton section={section} content={content} />

      {tab === "json" && (
        <>
          {parsedData ? (
            <JSONPretty
              booleanStyle={`color: ${colors.blue[400]};`}
              className="overflow-x-auto rounded-xl p-4"
              data={parsedData}
              id={`json-pretty-${section}`}
              keyStyle={`color: ${colors.blue[400]};`}
              mainStyle={`color: ${colors.gray[400]}; font-size: 12px;`}
              stringStyle={`color: ${colors.red[600]};`}
              valueStyle={`color: ${colors.red[600]};`}
            />
          ) : (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
              Invalid JSON format
            </div>
          )}
        </>
      )}

      {tab === "plain" && (
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-gray-800 dark:text-gray-200">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
};

type CopyButtonProps = {
  section: IOSection;
  content: string;
};

const CopyButton = ({ section, content }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <IconButton
      onClick={onClick}
      aria-label={isCopied ? `${section} Data Copied` : `Copy ${section} Data`}
      variant="ghost"
      className="absolute right-1.5 top-1.5"
    >
      {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </IconButton>
  );
};
