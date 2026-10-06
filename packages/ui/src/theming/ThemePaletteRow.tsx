import type { ReactElement, ReactNode } from "react";

export function ThemePaletteRow({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return <div className="flex flex-wrap justify-center gap-4">{children}</div>;
}
