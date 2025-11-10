# What is the purpose of this library?

Agent Trace UI is designed to be drop-in library for displaying agent traces. Our mission is to bring an easy way to quickly setup simple UI, with total control over the source code.

## Technologies

- We use [pnpm](https://pnpm.io) as package manager and [`pnpm workspaces`](https://pnpm.io/workspaces) for separation of packages.
- Our library is built for [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) and uses [Tailwind](https://tailwindcss.com/) for styling

Since our primary concept is having drop-in components with as little extra steps as possible, we try limiting dependencies to only those necessary:

- [lucide-react](https://lucide.dev/guide/packages/lucide-react) for icons
- [classnames](https://jedwatson.github.io/classnames/) for managing complex styles
- [radix primitives](https://www.radix-ui.com/primitives) in a few places - to help with building reliable and accessible components
- [react-json-pretty](https://www.npmjs.com/package/react-json-pretty) - lightweight package for displaying JSON data

## Structure

There are 4 packages:

| Name        | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| `ui`        | Contains components itself - `Button`, `Input`, `TraceList` etc |
| `data`      | Has utils and adapters for different data types                 |
| `types`     | Reusable global types - such as `TraceRecord`, `TraceSpan` etc. |
| `storybook` | For showcasing component                                        |

## Priorities

While developing new components or making changes to existing ones, we must focus on these key points:

- Accessibility by default. Our components should follow accessibility guidelines and conform to common accessibility standars, such as [WCAG](https://www.w3.org/TR/WCAG21/).
- All components should work and correctly display on any screen width, starting from 375px.
- All components should support both light and dark themes.
- The code must be clean, easy to understand and expand. Since we expect our users to adjust the source code for their needs, we should think of how they will approach this - and make their lives easier by providing easy-to-understand components.

## Making a contribution

1. Fork the repository.
1. In project root, run `pnpm i` to install all dependencies.
1. Run `pnpm run dev` to start a local dev server.
1. Create a branch in your repo, make changes and commit them. We follow [conventonal commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
1. Make a PR to the base repo.

## Style guide

Here are some rules we follow in our repository:

- When creating new component, place it inside `packages/ui/src/componens` folder.

```
packages
└── ui
    └── src
        └── components
            ├── Input.tsx
            ├── Button.tsx
            ├── ...
            ├── YourNewComponent.tsx
```

- If a component gets big, it's better to move some parts of it into separate, smaller components. Create a folder with the name of your component, place your component in this folder and add the "COMPONENT_NAME" prefix to all of the subcomponents. Like this:

```
packages
└── ui
    └── src
        └── components
            ├── Input.tsx
            ├── Button.tsx
            ├── ...
            └── YourComponent
                ├── YourComponent.tsx
                ├── YourComponentHeader.tsx
                ├── YourComponentContent.tsx
                └── YourComponentFooter.tsx
```

- When handling complex styling logic, where composition (especially conditional) of classes is required, use `classnames`:

```jsx
import cn from "classnames";

...

<div classNames={classnames(
  "flex items-center gap-2",
  "bg-gray-300 dark:bg-gray-700",
  selected && "border border-2 border-orange-400",
  hasChildren ? "p-4" : "p-2"
)}>
...
</div>
```

- When creating a new util or data adapter in `packages/data`, add tests for it. We use [Vitest](https://vitest.dev) for testing.

## Theming

We use semantic tokens, and theme is provided as `theme.css` and `index.ts` in `packages/ui/components/theme`. These 2 files are copied to user's project along with the rest of the components. How does it work:

- In `theme.css` we use syntax `--agentprism-tokenName: l c h;`, where l, c and h are Lightness, Chroma and Hue values of color in oklch format.
- Later in `index.ts` we create tailwind theme object, where each entry is `oklch(var(--${agentPrismPrefix}-${name}) / <alpha-value>)`. This way we will use variable's value for each token
- `agentPrismTailwindColors` are exported for use in tailwind config, and you need to import `theme.css` in your project (usually in a root file)

Why not define colors as `oklch(l c h)` in `theme.css`, and only use 3 numbers? We need this in order for opacity syntax (e.g. `text-gray/50`) to work, that's why we pass `<alpha-value>` when defining variable for tailwind config.

So to edit theme you will have to edit `theme.css` and `index.ts` by hand. To make our life a bit easier, we have some scripts in `packages/ui/src/theming/scripts`, and `pnpm run theme:generate` command (should be run from the root). It will take `agentPrismTheme` object from the `packages/ui/src/theming/theme.ts` and generate both `theme.css` and `index.ts` out of it.

Inisde this object we have categories, and do some extra work to use tokens from tailwind. It was done in this format to leave category comments in `theme.css` as well as comments like `/* gray.500 */` after each token. Also tokens are displayed in `ThemePalette`.

While our approach allows users to override the values in any way they want, we used tailwind tokens for the default theme for simplicity.

## Requesting new components

If you want new component to be added to the library, don't hesitate to create an issue on GitHub and start a discussion.
