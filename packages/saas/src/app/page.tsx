import { HomeContent } from "@/components/HomeContent";
import { TraceProvider } from "@/components/TraceProvider";

export default function Home() {
  return (
    <TraceProvider>
      <HomeContent />
    </TraceProvider>
  );
}
