interface SpanCardHorizontalConnectorProps {
  level: number;
  horizontalLineWidth: number;
}

export const SpanCardHorizontalConnector = ({
  level,
  horizontalLineWidth,
}: SpanCardHorizontalConnectorProps) => {
  if (level === 0) return null;

  return (
    <div
      className="absolute -left-[15px] top-2.5 h-0.5 bg-gray-100 dark:bg-gray-800"
      style={{ width: `${horizontalLineWidth}px` }}
    />
  );
};

export const SpanCardVerticalConnector = () => {
  return (
    <div className="absolute -top-3 ml-1 h-[calc(100%-9px)] w-0.5 translate-x-1/2 transform bg-gray-100 dark:bg-gray-800" />
  );
};
