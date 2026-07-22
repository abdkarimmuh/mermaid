# Mermaid Playground

A small Next.js app for writing [Mermaid](https://mermaid.js.org) diagrams and previewing them live in the browser.

## Features

- **`/editor`** — live editor, similar to [mermaid.live](https://mermaid.live):
  - Syntax-highlighted code editor (CodeMirror) on the left, live SVG preview on the right, updating as you type (debounced). Invalid syntax shows an inline error without losing the last valid diagram.
  - **Sample diagrams** menu to load a starting template for each supported diagram type.
  - **Actions**: copy code, download SVG, download PNG, reset to the default sample.
  - **Pan & zoom** on the preview — scroll to zoom toward the cursor, drag to pan, plus explicit zoom in/out/reset-view controls.
- **`/docs`** — a quick syntax cheatsheet covering flowcharts, sequence diagrams, class diagrams, state diagrams, Gantt charts, and pie charts.
- Light/dark theme, toggleable from the navbar.

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command          | Description                        |
| ---------------- | ----------------------------------- |
| `yarn dev`        | Start the dev server (Turbopack)    |
| `yarn build`      | Production build                    |
| `yarn start`      | Run the production build            |
| `yarn lint`       | Lint                                 |
| `yarn lint:fix`   | Lint with autofix                   |
| `yarn typecheck`  | Type-check with `tsc --noEmit`      |
| `yarn format`     | Format with Prettier                |

## Tech stack

- [Next.js](https://nextjs.org) (App Router), React 19, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [Mermaid](https://mermaid.js.org) for diagram parsing/rendering
- [next-themes](https://github.com/pacocoursey/next-themes) for light/dark mode

## Adding shadcn/ui components

```bash
npx shadcn@latest add <component>
```

This places generated components under `components/ui/`. Import them as:

```tsx
import { Button } from "@/components/ui/button";
```
