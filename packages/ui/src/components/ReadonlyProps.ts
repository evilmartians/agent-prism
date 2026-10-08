import type { DeepReadonly } from "@evilmartians/agent-prism-types";

/**
 * Component props as the component reads them: everything `DeepReadonly`
 * except `ref`, which React writes the element into.
 */
export type ReadonlyProps<Props> = DeepReadonly<Omit<Props, "ref">> &
  Pick<Props, Extract<keyof Props, "ref">>;
