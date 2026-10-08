import { type ReactElement } from "react";

import { type TabItem, Tabs } from "./Tabs";

export type TabSelectorProps<T extends string> = {
  className?: string | undefined;
  defaultValue?: T | undefined;
  items: readonly TabItem<T>[];
  onClick?: ((event: React.MouseEvent) => void) | undefined;
  onValueChange: (value: T) => void;
  theme?: "pill" | "underline" | undefined;
  value: T;
};

export const TabSelector = <T extends string>({
  className,
  defaultValue,
  items,
  onClick,
  onValueChange,
  theme = "underline",
  value,
}: Readonly<TabSelectorProps<T>>): ReactElement => {
  return (
    <Tabs<T>
      className={className}
      defaultValue={defaultValue}
      items={items}
      onClick={onClick}
      onValueChange={onValueChange}
      theme={theme}
      value={value}
    />
  );
};
