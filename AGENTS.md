# agent-prism

## Packages

| Package     | Role                                                                     | Published                |
| ----------- | ------------------------------------------------------------------------ | ------------------------ |
| `types`     | Trace types and attribute constants; source of truth for every type      | npm, ESM only            |
| `data`      | Adapters (Langfuse, OpenTelemetry) and pure helpers over `types`         | npm, ESM only            |
| `ui`        | React components users copy into their projects; imports `data`, `types` | no, copied from source   |
| `storybook` | Stories for `ui`, run as tests                                           | no, deployed to Firebase |
| `demo-app`  | Vite sandbox                                                             | no                       |
| `saas`      | Next.js trace explorer                                                   | no, deployed to Firebase |

## Rules

| Rule                                                                                                           | Enforced by                                                   |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Relative imports in `types` and `data` end in `.js`                                                            | `pnpm lint:check` (`import/extensions`), `pnpm lint:packages` |
| Imports in `ui` and the apps have no extension (`?raw`, `.css`, `.json` excepted)                              | `pnpm lint:check` (`import/extensions`)                       |
| `types` and `data` never import React, `ui` or an app; `types` never imports `data`; `ui` never imports an app | `pnpm lint:check` (`boundaries/dependencies`)                 |
| No `//` comments; JSDoc only in `types`, `data`, `ui`                                                          | `pnpm lint:check` (`comments/no-comments`)                    |
| Strict TypeScript, no `any`, no unchecked index access                                                         | `pnpm tsc`, `pnpm lint:check`                                 |
| Type-aware rules in `.ts`/`.tsx`: no floating promises, no unsafe `any`, strict boolean conditions             | `pnpm lint:check` (`--type-aware`, tsgolint)                  |
| Prettier formatting                                                                                            | `pnpm format:check`                                           |
| `data` tests run in UTC and keep coverage above the thresholds in `packages/data/vitest.config.ts`             | `pnpm test --coverage`                                        |
| No unused files, exports or dependencies                                                                       | `pnpm knip`                                                   |
| No copy-pasted code in `types`, `data`, `ui`                                                                   | `pnpm jscpd`                                                  |
| No type that spells out one from `packages/types`, no two identical object shapes                              | `pnpm dup:types`                                              |
| Stories render and pass axe; `color-contrast` is off until #107                                                | `pnpm test:storybook`                                         |
| `packages/ui/src/components/theme` is generated from `packages/ui/src/theming/theme.ts`                        | `pnpm theme:check`                                            |
| Published `types` and `data` resolve for consumers                                                             | `pnpm lint:packages` (publint, attw)                          |
| Workflows pass zizmor                                                                                          | `check-workflows.yaml`                                        |

Every check above runs in `.github/workflows/ci.yml`; the `main` job gates merges.

## Publishing

1. Bump `version` in `packages/types/package.json` and `packages/data/package.json` to the same value.
2. Push tag `vX.Y.Z`. `publish.yaml` fails if the tag differs from either version.
3. CI builds and tests, then stages both packages on npm through Trusted Publishing (OIDC, no npm token) with provenance.
4. A maintainer approves the staged release on npm with 2FA.

Never publish from a local machine.

## Commits

Conventional commits. `lefthook` runs oxlint and Prettier on staged files before commit and `pnpm tsc` before push.
