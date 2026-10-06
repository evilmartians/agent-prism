import type { ComponentPropsWithRef } from "react";

import * as RadixTabs from "@radix-ui/react-tabs";
import cn from "classnames";
import * as React from "react";

import type { ReadonlyProps } from "./ReadonlyProps";

export type TabItem<T extends string = string> = {
  readonly disabled?: boolean | undefined;
  readonly icon?: React.ReactNode | undefined;
  readonly label: string;
  readonly value: T;
};

export type TabTheme = "pill" | "underline";

const BASE_TRIGGER =
  "text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

const THEMES = {
  pill: {
    list: "h-9 inline-flex gap-1 p-1 bg-agentprism-secondary rounded-lg",
    trigger: `px-3 ${BASE_TRIGGER} rounded-md
      text-agentprism-muted-foreground data-[state=active]:text-agentprism-foreground
      data-[state=inactive]:[&:not(:disabled)]:hover:bg-agentprism-background/50 data-[state=active]:bg-agentprism-background data-[state=active]:shadow-sm
      dark:data-[state=active]:shadow-none`,
  },
  underline: {
    list: "h-9 flex border-b border-agentprism-border",
    trigger: `w-full justify-center px-3 ${BASE_TRIGGER} 
      text-agentprism-secondary-foreground data-[state=active]:text-agentprism-foreground
      border-b-2 border-transparent data-[state=active]:border-agentprism-border-inverse
      -mb-[2px]
      data-[state=inactive]:[&:not(:disabled)]:hover:border-agentprism-border-inverse/20
      data-[state=inactive]:[&:not(:disabled)]:hover:text-agentprism-muted-foreground`,
  },
} as const;

export type TabsProps<T extends string = string> =
  ReadonlyProps<TabsLayoutProps> & TabsValueProps<T>;

type TabsLayoutProps = Omit<ComponentPropsWithRef<"div">, "dir"> & {
  /**
   * Optional className for the root container
   */
  className?: string | undefined;

  /**
   * The direction of the content of the tabs
   */
  dir?: "ltr" | "rtl" | undefined;

  /**
   * Optional className for the tabs list container
   */
  tabsListClassName?: string | undefined;

  /**
   * Visual theme variant for the tabs
   * @default "underline"
   */
  theme?: TabTheme | undefined;

  /**
   * Optional className for individual tab triggers
   */
  triggerClassName?: string | undefined;
};

type TabsValueProps<T extends string> = {
  /**
   * The initially selected tab value (uncontrolled)
   */
  readonly defaultValue?: T | undefined;

  /**
   * Array of tab items to display
   */
  readonly items: readonly TabItem<T>[];

  /**
   * Callback fired when the selected tab changes
   */
  readonly onValueChange?: ((value: T) => void) | undefined;

  /**
   * The currently selected tab value (controlled)
   */
  readonly value?: T | undefined;
};

export const Tabs = <T extends string = string>({
  className = "",
  defaultValue,
  dir,
  items,
  onValueChange,
  tabsListClassName = "",
  theme = "underline",
  triggerClassName = "",
  value,
  ...rest
}: TabsProps<T>): React.ReactElement => {
  const defaultTab =
    defaultValue !== undefined && defaultValue !== ""
      ? defaultValue
      : items[0]?.value;

  const currentTheme = THEMES[theme];

  return (
    <RadixTabs.Root
      className={className}
      {...(defaultTab === undefined ? {} : { defaultValue: defaultTab })}
      {...(value === undefined ? {} : { value })}
      onValueChange={(next) => {
        const selected = items.find((item) => item.value === next);

        if (selected !== undefined) onValueChange?.(selected.value);
      }}
      {...(dir === undefined ? {} : { dir })}
      {...rest}
    >
      <RadixTabs.List
        aria-label="Navigation tabs"
        className={cn(currentTheme.list, tabsListClassName)}
      >
        {items.map((item) => (
          <RadixTabs.Trigger
            aria-controls={undefined}
            className={cn(
              "group flex items-center overflow-hidden",
              currentTheme.trigger,
              triggerClassName,
            )}
            disabled={item.disabled}
            key={item.value}
            value={item.value}
          >
            {Boolean(item.icon) && (
              <span className="text-agentprism-secondary-foreground mr-2 group-data-[state=active]:text-current">
                {item.icon}
              </span>
            )}
            <span className="truncate text-sm font-medium">{item.label}</span>
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
    </RadixTabs.Root>
  );
};
