import { useSyncExternalStore } from "react";

import { useIsMounted } from "./useIsMounted";

const MOBILE_MEDIA_QUERY = "(max-width: 1023px)";

const subscribeToMobileMediaQuery = (onChange: () => void): (() => void) => {
  const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
};

export const useIsMobile = (): boolean => {
  const isMounted = useIsMounted();

  const isMobile = useSyncExternalStore(
    subscribeToMobileMediaQuery,
    () => window.matchMedia(MOBILE_MEDIA_QUERY).matches,
    () => false,
  );

  return isMounted ? isMobile : false;
};
