import { type FC } from "react";
import JSONPretty from "react-json-pretty";
import colors from "tailwindcss/colors";

export interface JsonViewerProps {
  content: string;
  id: string;
  className?: string;
}

export const DetailsViewJsonOutput: FC<JsonViewerProps> = ({
  content,
  id,
  className = "",
}) => {
  return (
    <JSONPretty
      booleanStyle={`color: ${colors.blue[800]};`}
      className={`overflow-x-hidden rounded-xl p-4 text-left ${className}`}
      data={content}
      id={`json-pretty-${id}`}
      keyStyle={`color: ${colors.blue[600]};`}
      mainStyle={`color: ${colors.gray[400]}; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;`}
      stringStyle={`color: ${colors.red[800]};`}
      valueStyle={`color: ${colors.red[800]};`}
    />
  );
};
