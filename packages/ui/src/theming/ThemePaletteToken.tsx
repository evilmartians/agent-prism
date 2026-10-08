import type { ReactElement } from "react";

import cn from "classnames";

import { AGENT_PRISM_PREFIX, agentPrismTheme } from "./theme";

const tokensFlat = agentPrismTheme.tokenGroups.flatMap((group) => group.tokens);

type ThemePaletteTokenProps = {
  bg: string;
  name: string;
};

export function ThemePaletteToken({
  bg,
  name,
}: Readonly<ThemePaletteTokenProps>): ReactElement {
  const tokenName = bg.replace(`bg-${AGENT_PRISM_PREFIX}-`, "");
  const token = tokensFlat.find((candidate) => candidate.name === tokenName);

  return (
    <div className="flex h-[250px] w-[200px] flex-col border border-black/50 dark:border-white/50">
      <div className="truncate border-b border-black/50 p-4 text-black dark:border-white/50 dark:text-white">
        {name}
        <hr className="my-2 bg-black/50 dark:bg-white/50" />
        <span className="hidden dark:block">{token?.dark}</span>
        <span className="dark:hidden">{token?.light}</span>
      </div>
      <div className={cn("grow", bg)} />
    </div>
  );
}
