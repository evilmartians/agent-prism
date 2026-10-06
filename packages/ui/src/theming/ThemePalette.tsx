import type { ReactElement } from "react";

import { ThemePaletteGroup } from "./ThemePaletteGroup";
import { ThemePaletteRow } from "./ThemePaletteRow";
import { ThemePaletteToken } from "./ThemePaletteToken";

export function ThemePalette(): ReactElement {
  return (
    <div className="flex flex-col gap-12">
      <ThemePaletteGroup title="Brand colors">
        <ThemePaletteRow>
          <ThemePaletteToken name="brand" bg="bg-agentprism-brand" />
          <ThemePaletteToken
            name="brand-foreground"
            bg="bg-agentprism-brand-foreground"
          />
          <ThemePaletteToken
            name="brand-secondary"
            bg="bg-agentprism-brand-secondary"
          />
          <ThemePaletteToken
            name="brand-secondary-foreground"
            bg="bg-agentprism-brand-secondary-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="General purpose colors">
        <ThemePaletteRow>
          <ThemePaletteToken name="background" bg="bg-agentprism-background" />
          <ThemePaletteToken name="foreground" bg="bg-agentprism-foreground" />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken name="primary" bg="bg-agentprism-primary" />
          <ThemePaletteToken
            name="primary-foreground"
            bg="bg-agentprism-primary-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken name="secondary" bg="bg-agentprism-secondary" />
          <ThemePaletteToken
            name="secondary-foreground"
            bg="bg-agentprism-secondary-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken name="muted" bg="bg-agentprism-muted" />
          <ThemePaletteToken
            name="muted-foreground"
            bg="bg-agentprism-muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken name="accent" bg="bg-agentprism-accent" />
          <ThemePaletteToken
            name="accent-foreground"
            bg="bg-agentprism-accent-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Borders">
        <ThemePaletteRow>
          <ThemePaletteToken name="border" bg="bg-agentprism-border" />
          <ThemePaletteToken
            name="border-subtle"
            bg="bg-agentprism-border-subtle"
          />
          <ThemePaletteToken
            name="border-strong"
            bg="bg-agentprism-border-strong"
          />
          <ThemePaletteToken
            name="border-inverse"
            bg="bg-agentprism-border-inverse"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Status colors">
        <ThemePaletteRow>
          <ThemePaletteToken name="success" bg="bg-agentprism-success" />
          <ThemePaletteToken
            name="success-muted"
            bg="bg-agentprism-success-muted"
          />
          <ThemePaletteToken
            name="success-muted-foreground"
            bg="bg-agentprism-success-muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken name="error" bg="bg-agentprism-error" />
          <ThemePaletteToken
            name="error-muted"
            bg="bg-agentprism-error-muted"
          />
          <ThemePaletteToken
            name="error-muted-foreground"
            bg="bg-agentprism-error-muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken name="warning" bg="bg-agentprism-warning" />
          <ThemePaletteToken
            name="warning-muted"
            bg="bg-agentprism-warning-muted"
          />
          <ThemePaletteToken
            name="warning-muted-foreground"
            bg="bg-agentprism-warning-muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken name="pending" bg="bg-agentprism-pending" />
          <ThemePaletteToken
            name="pending-muted"
            bg="bg-agentprism-pending-muted"
          />
          <ThemePaletteToken
            name="pending-muted-foreground"
            bg="bg-agentprism-pending-muted-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Code syntax highlighting">
        <ThemePaletteRow>
          <ThemePaletteToken
            name="code-string"
            bg="bg-agentprism-code-string"
          />
          <ThemePaletteToken
            name="code-number"
            bg="bg-agentprism-code-number"
          />
          <ThemePaletteToken
            name="code-boolean"
            bg="bg-agentprism-code-boolean"
          />
          <ThemePaletteToken name="code-key" bg="bg-agentprism-code-key" />
          <ThemePaletteToken name="code-base" bg="bg-agentprism-code-base" />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Generic badge colors">
        <ThemePaletteRow>
          <ThemePaletteToken
            name="badge-default"
            bg="bg-agentprism-badge-default"
          />
          <ThemePaletteToken
            name="badge-default-foreground"
            bg="bg-agentprism-badge-default-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Trace colors">
        <ThemePaletteRow>
          <ThemePaletteToken name="avatar-llm" bg="bg-agentprism-avatar-llm" />
          <ThemePaletteToken name="badge-llm" bg="bg-agentprism-badge-llm" />
          <ThemePaletteToken
            name="badge-llm-foreground"
            bg="bg-agentprism-badge-llm-foreground"
          />
          <ThemePaletteToken
            name="timeline-llm"
            bg="bg-agentprism-timeline-llm"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-agent"
            bg="bg-agentprism-avatar-agent"
          />
          <ThemePaletteToken
            name="badge-agent"
            bg="bg-agentprism-badge-agent"
          />
          <ThemePaletteToken
            name="badge-agent-foreground"
            bg="bg-agentprism-badge-agent-foreground"
          />
          <ThemePaletteToken
            name="timeline-agent"
            bg="bg-agentprism-timeline-agent"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-tool"
            bg="bg-agentprism-avatar-tool"
          />
          <ThemePaletteToken name="badge-tool" bg="bg-agentprism-badge-tool" />
          <ThemePaletteToken
            name="badge-tool-foreground"
            bg="bg-agentprism-badge-tool-foreground"
          />
          <ThemePaletteToken
            name="timeline-tool"
            bg="bg-agentprism-timeline-tool"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-chain"
            bg="bg-agentprism-avatar-chain"
          />
          <ThemePaletteToken
            name="badge-chain"
            bg="bg-agentprism-badge-chain"
          />
          <ThemePaletteToken
            name="badge-chain-foreground"
            bg="bg-agentprism-badge-chain-foreground"
          />
          <ThemePaletteToken
            name="timeline-chain"
            bg="bg-agentprism-timeline-chain"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-retrieval"
            bg="bg-agentprism-avatar-retrieval"
          />
          <ThemePaletteToken
            name="badge-retrieval"
            bg="bg-agentprism-badge-retrieval"
          />
          <ThemePaletteToken
            name="badge-retrieval-foreground"
            bg="bg-agentprism-badge-retrieval-foreground"
          />
          <ThemePaletteToken
            name="timeline-retrieval"
            bg="bg-agentprism-timeline-retrieval"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-embedding"
            bg="bg-agentprism-avatar-embedding"
          />
          <ThemePaletteToken
            name="badge-embedding"
            bg="bg-agentprism-badge-embedding"
          />
          <ThemePaletteToken
            name="badge-embedding-foreground"
            bg="bg-agentprism-badge-embedding-foreground"
          />
          <ThemePaletteToken
            name="timeline-embedding"
            bg="bg-agentprism-timeline-embedding"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-guardrail"
            bg="bg-agentprism-avatar-guardrail"
          />
          <ThemePaletteToken
            name="badge-guardrail"
            bg="bg-agentprism-badge-guardrail"
          />
          <ThemePaletteToken
            name="badge-guardrail-foreground"
            bg="bg-agentprism-badge-guardrail-foreground"
          />
          <ThemePaletteToken
            name="timeline-guardrail"
            bg="bg-agentprism-timeline-guardrail"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-create-agent"
            bg="bg-agentprism-avatar-create-agent"
          />
          <ThemePaletteToken
            name="badge-create-agent"
            bg="bg-agentprism-badge-create-agent"
          />
          <ThemePaletteToken
            name="badge-create-agent-foreground"
            bg="bg-agentprism-badge-create-agent-foreground"
          />
          <ThemePaletteToken
            name="timeline-create-agent"
            bg="bg-agentprism-timeline-create-agent"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-span"
            bg="bg-agentprism-avatar-span"
          />
          <ThemePaletteToken name="badge-span" bg="bg-agentprism-badge-span" />
          <ThemePaletteToken
            name="badge-span-foreground"
            bg="bg-agentprism-badge-span-foreground"
          />
          <ThemePaletteToken
            name="timeline-span"
            bg="bg-agentprism-timeline-span"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-event"
            bg="bg-agentprism-avatar-event"
          />
          <ThemePaletteToken
            name="badge-event"
            bg="bg-agentprism-badge-event"
          />
          <ThemePaletteToken
            name="badge-event-foreground"
            bg="bg-agentprism-badge-event-foreground"
          />
          <ThemePaletteToken
            name="timeline-event"
            bg="bg-agentprism-timeline-event"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            name="avatar-unknown"
            bg="bg-agentprism-avatar-unknown"
          />
          <ThemePaletteToken
            name="badge-unknown"
            bg="bg-agentprism-badge-unknown"
          />
          <ThemePaletteToken
            name="badge-unknown-foreground"
            bg="bg-agentprism-badge-unknown-foreground"
          />
          <ThemePaletteToken
            name="timeline-unknown"
            bg="bg-agentprism-timeline-unknown"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>
    </div>
  );
}
