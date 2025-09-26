import { HomeContent } from "@/components/HomeContent.tsx";
import { TraceProvider } from "@/components/TraceProvider.tsx";

export default function Home() {
  return (
    <TraceProvider>
      <HomeContent />
    </TraceProvider>
  );
}
