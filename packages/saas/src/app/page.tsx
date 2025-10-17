import PlausibleProvider from "next-plausible";

import { HomeContent } from "@/components/HomeContent";
import { TraceProvider } from "@/components/TraceProvider";

export default function Home() {
  return (
    <PlausibleProvider domain="agent-prism.evilmartians.io">
      <TraceProvider>
        <HomeContent />
      </TraceProvider>
    </PlausibleProvider>
  );
}
