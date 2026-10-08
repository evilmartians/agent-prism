import type { ReactElement } from "react";

import { ThemePaletteGroup } from "./ThemePaletteGroup";
import { ThemePaletteRow } from "./ThemePaletteRow";
import { ThemePaletteToken } from "./ThemePaletteToken";

export function ThemePalette(): ReactElement {
  return (
    <div className="flex flex-col gap-12">
      <ThemePaletteGroup title="Brand colors">
        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-brand" name="brand" />
          <ThemePaletteToken
            bg="bg-agentprism-brand-foreground"
            name="brand-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-brand-secondary"
            name="brand-secondary"
          />
          <ThemePaletteToken
            bg="bg-agentprism-brand-secondary-foreground"
            name="brand-secondary-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="General purpose colors">
        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-background" name="background" />
          <ThemePaletteToken bg="bg-agentprism-foreground" name="foreground" />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-primary" name="primary" />
          <ThemePaletteToken
            bg="bg-agentprism-primary-foreground"
            name="primary-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-secondary" name="secondary" />
          <ThemePaletteToken
            bg="bg-agentprism-secondary-foreground"
            name="secondary-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-muted" name="muted" />
          <ThemePaletteToken
            bg="bg-agentprism-muted-foreground"
            name="muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-accent" name="accent" />
          <ThemePaletteToken
            bg="bg-agentprism-accent-foreground"
            name="accent-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Borders">
        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-border" name="border" />
          <ThemePaletteToken
            bg="bg-agentprism-border-subtle"
            name="border-subtle"
          />
          <ThemePaletteToken
            bg="bg-agentprism-border-strong"
            name="border-strong"
          />
          <ThemePaletteToken
            bg="bg-agentprism-border-inverse"
            name="border-inverse"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Status colors">
        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-success" name="success" />
          <ThemePaletteToken
            bg="bg-agentprism-success-muted"
            name="success-muted"
          />
          <ThemePaletteToken
            bg="bg-agentprism-success-muted-foreground"
            name="success-muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-error" name="error" />
          <ThemePaletteToken
            bg="bg-agentprism-error-muted"
            name="error-muted"
          />
          <ThemePaletteToken
            bg="bg-agentprism-error-muted-foreground"
            name="error-muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-warning" name="warning" />
          <ThemePaletteToken
            bg="bg-agentprism-warning-muted"
            name="warning-muted"
          />
          <ThemePaletteToken
            bg="bg-agentprism-warning-muted-foreground"
            name="warning-muted-foreground"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-pending" name="pending" />
          <ThemePaletteToken
            bg="bg-agentprism-pending-muted"
            name="pending-muted"
          />
          <ThemePaletteToken
            bg="bg-agentprism-pending-muted-foreground"
            name="pending-muted-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Code syntax highlighting">
        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-code-string"
            name="code-string"
          />
          <ThemePaletteToken
            bg="bg-agentprism-code-number"
            name="code-number"
          />
          <ThemePaletteToken
            bg="bg-agentprism-code-boolean"
            name="code-boolean"
          />
          <ThemePaletteToken bg="bg-agentprism-code-key" name="code-key" />
          <ThemePaletteToken bg="bg-agentprism-code-base" name="code-base" />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Generic badge colors">
        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-badge-default"
            name="badge-default"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-default-foreground"
            name="badge-default-foreground"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>

      <ThemePaletteGroup title="Trace colors">
        <ThemePaletteRow>
          <ThemePaletteToken bg="bg-agentprism-avatar-llm" name="avatar-llm" />
          <ThemePaletteToken bg="bg-agentprism-badge-llm" name="badge-llm" />
          <ThemePaletteToken
            bg="bg-agentprism-badge-llm-foreground"
            name="badge-llm-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-llm"
            name="timeline-llm"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-agent"
            name="avatar-agent"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-agent"
            name="badge-agent"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-agent-foreground"
            name="badge-agent-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-agent"
            name="timeline-agent"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-tool"
            name="avatar-tool"
          />
          <ThemePaletteToken bg="bg-agentprism-badge-tool" name="badge-tool" />
          <ThemePaletteToken
            bg="bg-agentprism-badge-tool-foreground"
            name="badge-tool-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-tool"
            name="timeline-tool"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-chain"
            name="avatar-chain"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-chain"
            name="badge-chain"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-chain-foreground"
            name="badge-chain-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-chain"
            name="timeline-chain"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-retrieval"
            name="avatar-retrieval"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-retrieval"
            name="badge-retrieval"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-retrieval-foreground"
            name="badge-retrieval-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-retrieval"
            name="timeline-retrieval"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-embedding"
            name="avatar-embedding"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-embedding"
            name="badge-embedding"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-embedding-foreground"
            name="badge-embedding-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-embedding"
            name="timeline-embedding"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-guardrail"
            name="avatar-guardrail"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-guardrail"
            name="badge-guardrail"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-guardrail-foreground"
            name="badge-guardrail-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-guardrail"
            name="timeline-guardrail"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-create-agent"
            name="avatar-create-agent"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-create-agent"
            name="badge-create-agent"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-create-agent-foreground"
            name="badge-create-agent-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-create-agent"
            name="timeline-create-agent"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-span"
            name="avatar-span"
          />
          <ThemePaletteToken bg="bg-agentprism-badge-span" name="badge-span" />
          <ThemePaletteToken
            bg="bg-agentprism-badge-span-foreground"
            name="badge-span-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-span"
            name="timeline-span"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-event"
            name="avatar-event"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-event"
            name="badge-event"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-event-foreground"
            name="badge-event-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-event"
            name="timeline-event"
          />
        </ThemePaletteRow>

        <ThemePaletteRow>
          <ThemePaletteToken
            bg="bg-agentprism-avatar-unknown"
            name="avatar-unknown"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-unknown"
            name="badge-unknown"
          />
          <ThemePaletteToken
            bg="bg-agentprism-badge-unknown-foreground"
            name="badge-unknown-foreground"
          />
          <ThemePaletteToken
            bg="bg-agentprism-timeline-unknown"
            name="timeline-unknown"
          />
        </ThemePaletteRow>
      </ThemePaletteGroup>
    </div>
  );
}
