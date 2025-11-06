import cn from "classnames";

export function ThemePalette() {
  return (
    <div className="flex flex-col gap-8">
      <Row>
        <Token name="background" bg="bg-agentprism-background" />
        <Token name="foreground" bg="bg-agentprism-foreground" />
      </Row>

      <Row>
        <Token name="primary" bg="bg-agentprism-primary" />
        <Token
          name="primary-foreground"
          bg="bg-agentprism-primary-foreground"
        />
      </Row>

      <Row>
        <Token name="secondary" bg="bg-agentprism-secondary" />
        <Token
          name="secondary-foreground"
          bg="bg-agentprism-secondary-foreground"
        />
      </Row>

      <Row>
        <Token name="muted" bg="bg-agentprism-muted" />
        <Token name="muted-foreground" bg="bg-agentprism-muted-foreground" />
      </Row>

      <Row>
        <Token name="accent" bg="bg-agentprism-accent" />
        <Token name="accent-foreground" bg="bg-agentprism-accent-foreground" />
      </Row>

      <Row>
        <Token name="border" bg="bg-agentprism-border" />
        <Token name="border-subtle" bg="bg-agentprism-border-subtle" />
        <Token name="border-strong" bg="bg-agentprism-border-strong" />
        <Token name="border-inverse" bg="bg-agentprism-border-inverse" />
      </Row>

      <Row>
        <Token name="success" bg="bg-agentprism-success" />
        <Token name="success-muted" bg="bg-agentprism-success-muted" />
        <Token
          name="success-muted-foreground"
          bg="bg-agentprism-success-muted-foreground"
        />
      </Row>

      <Row>
        <Token name="error" bg="bg-agentprism-error" />
        <Token name="error-muted" bg="bg-agentprism-error-muted" />
        <Token
          name="error-muted-foreground"
          bg="bg-agentprism-error-muted-foreground"
        />
      </Row>

      <Row>
        <Token name="warning" bg="bg-agentprism-warning" />
        <Token name="warning-muted" bg="bg-agentprism-warning-muted" />
        <Token
          name="warning-muted-foreground"
          bg="bg-agentprism-warning-muted-foreground"
        />
      </Row>

      <Row>
        <Token name="pending" bg="bg-agentprism-pending" />
        <Token name="pending-muted" bg="bg-agentprism-pending-muted" />
        <Token
          name="pending-muted-foreground"
          bg="bg-agentprism-pending-muted-foreground"
        />
      </Row>

      <Row>
        <Token name="code-string" bg="bg-agentprism-code-string" />
        <Token name="code-number" bg="bg-agentprism-code-number" />
        <Token name="code-boolean" bg="bg-agentprism-code-boolean" />
        <Token name="code-key" bg="bg-agentprism-code-key" />
        <Token name="code-base" bg="bg-agentprism-code-base" />
      </Row>

      <Row>
        <Token name="badge-default" bg="bg-agentprism-badge-default" />
        <Token
          name="badge-default-foreground"
          bg="bg-agentprism-badge-default-foreground"
        />
      </Row>

      <Row>
        <Token name="avatar-llm" bg="bg-agentprism-avatar-llm" />
        <Token name="badge-llm" bg="bg-agentprism-badge-llm" />
        <Token
          name="badge-llm-foreground"
          bg="bg-agentprism-badge-llm-foreground"
        />
        <Token name="timeline-llm" bg="bg-agentprism-timeline-llm" />
      </Row>

      <Row>
        <Token name="avatar-agent" bg="bg-agentprism-avatar-agent" />
        <Token name="badge-agent" bg="bg-agentprism-badge-agent" />
        <Token
          name="badge-agent-foreground"
          bg="bg-agentprism-badge-agent-foreground"
        />
        <Token name="timeline-agent" bg="bg-agentprism-timeline-agent" />
      </Row>

      <Row>
        <Token name="avatar-tool" bg="bg-agentprism-avatar-tool" />
        <Token name="badge-tool" bg="bg-agentprism-badge-tool" />
        <Token
          name="badge-tool-foreground"
          bg="bg-agentprism-badge-tool-foreground"
        />
        <Token name="timeline-tool" bg="bg-agentprism-timeline-tool" />
      </Row>

      <Row>
        <Token name="avatar-chain" bg="bg-agentprism-avatar-chain" />
        <Token name="badge-chain" bg="bg-agentprism-badge-chain" />
        <Token
          name="badge-chain-foreground"
          bg="bg-agentprism-badge-chain-foreground"
        />
        <Token name="timeline-chain" bg="bg-agentprism-timeline-chain" />
      </Row>

      <Row>
        <Token name="avatar-retrieval" bg="bg-agentprism-avatar-retrieval" />
        <Token name="badge-retrieval" bg="bg-agentprism-badge-retrieval" />
        <Token
          name="badge-retrieval-foreground"
          bg="bg-agentprism-badge-retrieval-foreground"
        />
        <Token
          name="timeline-retrieval"
          bg="bg-agentprism-timeline-retrieval"
        />
      </Row>

      <Row>
        <Token name="avatar-embedding" bg="bg-agentprism-avatar-embedding" />
        <Token name="badge-embedding" bg="bg-agentprism-badge-embedding" />
        <Token
          name="badge-embedding-foreground"
          bg="bg-agentprism-badge-embedding-foreground"
        />
        <Token
          name="timeline-embedding"
          bg="bg-agentprism-timeline-embedding"
        />
      </Row>

      <Row>
        <Token name="avatar-guardrail" bg="bg-agentprism-avatar-guardrail" />
        <Token name="badge-guardrail" bg="bg-agentprism-badge-guardrail" />
        <Token
          name="badge-guardrail-foreground"
          bg="bg-agentprism-badge-guardrail-foreground"
        />
        <Token
          name="timeline-guardrail"
          bg="bg-agentprism-timeline-guardrail"
        />
      </Row>

      <Row>
        <Token
          name="avatar-create-agent"
          bg="bg-agentprism-avatar-create-agent"
        />
        <Token
          name="badge-create-agent"
          bg="bg-agentprism-badge-create-agent"
        />
        <Token
          name="badge-create-agent-foreground"
          bg="bg-agentprism-badge-create-agent-foreground"
        />
        <Token
          name="timeline-create-agent"
          bg="bg-agentprism-timeline-create-agent"
        />
      </Row>

      <Row>
        <Token name="avatar-span" bg="bg-agentprism-avatar-span" />
        <Token name="badge-span" bg="bg-agentprism-badge-span" />
        <Token
          name="badge-span-foreground"
          bg="bg-agentprism-badge-span-foreground"
        />
        <Token name="timeline-span" bg="bg-agentprism-timeline-span" />
      </Row>

      <Row>
        <Token name="avatar-event" bg="bg-agentprism-avatar-event" />
        <Token name="badge-event" bg="bg-agentprism-badge-event" />
        <Token
          name="badge-event-foreground"
          bg="bg-agentprism-badge-event-foreground"
        />
        <Token name="timeline-event" bg="bg-agentprism-timeline-event" />
      </Row>

      <Row>
        <Token name="avatar-unknown" bg="bg-agentprism-avatar-unknown" />
        <Token name="badge-unknown" bg="bg-agentprism-badge-unknown" />
        <Token
          name="badge-unknown-foreground"
          bg="bg-agentprism-badge-unknown-foreground"
        />
        <Token name="timeline-unknown" bg="bg-agentprism-timeline-unknown" />
      </Row>
    </div>
  );
}

type TokenProps = {
  name: string;
  bg: string;
};

function Token({ name, bg }: TokenProps) {
  return (
    <div className="flex h-[250px] w-[200px] flex-col border border-black/50 dark:border-white/50">
      <div className="truncate border-b border-black/50 p-4 dark:border-white/50">
        {name}
      </div>
      <div className={cn("grow", bg)} />
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap justify-center gap-4">{children}</div>;
}
