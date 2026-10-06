import { type FC } from "react";

import { AnthropicLogo } from "./BrandLogos/AnthropicLogo";
import { GoogleLogo } from "./BrandLogos/GoogleLogo";
import { MetaLogo } from "./BrandLogos/MetaLogo";
import { MistralLogo } from "./BrandLogos/MistralLogo";
import { OpenAILogo } from "./BrandLogos/OpenAILogo";
import { PerplexityLogo } from "./BrandLogos/PerplexityLogo";

// Logo registry
const LOGO_REGISTRY = {
  openai: OpenAILogo,
  anthropic: AnthropicLogo,
  google: GoogleLogo,
  meta: MetaLogo,
  mistral: MistralLogo,
  perplexity: PerplexityLogo,
} as const;

type BrandType = keyof typeof LOGO_REGISTRY;

type BrandLogoProps = {
  brand: BrandType | string;
  className?: string | undefined;
  fallback?: React.ReactNode | undefined;
};

export const BrandLogo: FC<BrandLogoProps> = ({
  brand,
  className = "size-4",
  fallback = null,
}) => {
  const Logo = LOGO_REGISTRY[brand as BrandType];

  if (!Logo) return <>{fallback}</>;

  return <Logo className={className} />;
};
