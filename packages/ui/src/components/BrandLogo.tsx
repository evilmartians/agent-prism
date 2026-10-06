import { type FC } from "react";

import { AnthropicLogo } from "./BrandLogos/AnthropicLogo";
import { GoogleLogo } from "./BrandLogos/GoogleLogo";
import { MetaLogo } from "./BrandLogos/MetaLogo";
import { MistralLogo } from "./BrandLogos/MistralLogo";
import { OpenAILogo } from "./BrandLogos/OpenAILogo";
import { PerplexityLogo } from "./BrandLogos/PerplexityLogo";

const LOGO_REGISTRY = new Map(
  Object.entries({
    anthropic: AnthropicLogo,
    google: GoogleLogo,
    meta: MetaLogo,
    mistral: MistralLogo,
    openai: OpenAILogo,
    perplexity: PerplexityLogo,
  }),
);

type BrandLogoProps = {
  brand: string;
  className?: string | undefined;
  fallback?: React.ReactNode | undefined;
};

export const BrandLogo: FC<BrandLogoProps> = ({
  brand,
  className = "size-4",
  fallback = null,
}) => {
  const Logo = LOGO_REGISTRY.get(brand);

  if (Logo === undefined) return <>{fallback}</>;

  return <Logo className={className} />;
};
