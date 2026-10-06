import { type ReactElement } from "react";

import { type TabItem, Tabs } from "./Tabs";

export interface TabSelectorProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  defaultValue?: T | undefined;
  theme?: "underline" | "pill" | undefined;
  className?: string | undefined;
  onClick?: ((event: React.MouseEvent) => void) | undefined;
}

export const TabSelector = <T extends string>({
  items,
  value,
  onValueChange,
  defaultValue,
  theme = "underline",
  className,
  onClick,
}: TabSelectorProps<T>): ReactElement => {
  return (
    <Tabs<T>
      items={items}
      value={value}
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      theme={theme}
      className={className}
      onClick={onClick}
    />
  );
};
