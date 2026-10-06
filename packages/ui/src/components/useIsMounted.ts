import { useSyncExternalStore } from "react";

const subscribeToNothing = (): (() => void) => () => undefined;

export const useIsMounted = (): boolean =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
