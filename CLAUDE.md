# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server (Turbopack) at http://localhost:3000
yarn build        # Production build
yarn start        # Run production build
yarn lint         # ESLint
yarn lint:fix     # ESLint with autofix
yarn format       # Prettier --write on **/*.{ts,tsx}
yarn typecheck    # tsc --noEmit
```

There is no test runner configured in this repo. Both `yarn.lock` and `package-lock.json` are committed and kept in sync — either package manager works, but prefer `yarn` to match existing usage.

Add shadcn/ui components via the CLI rather than hand-writing them, so generated files match the configured style/tokens:

```bash
npx shadcn@latest add <component>
```

## Critical: this is not the Next.js you know

Per `AGENTS.md`, this project pins a Next.js version with breaking changes vs. common training data — APIs, conventions, and file structure may differ. **Read the relevant guide under `node_modules/next/dist/docs/` before writing App Router code**, especially anything touching Server/Client Component boundaries or `next/dynamic`. One confirmed breaking behavior: `next/dynamic(..., { ssr: false })` throws a build error when used inside a Server Component — it's only valid inside a Client Component. This is why browser-only libraries (e.g. `mermaid`) are loaded via a plain `import("mermaid")` inside a `useEffect` in a `"use client"` component instead.

## Architecture

Next.js App Router + React 19 + Tailwind v4 + shadcn/ui (`components.json`: style `base-vega`, base color neutral, icon library `lucide`).

**Routes** (`app/`):
- `/` — landing page.
- `/editor` — the Mermaid live editor (`components/mermaid/mermaid-editor.tsx`).
- `/docs` — static Mermaid syntax cheatsheet.

Page-level `metadata` exports combine with the root layout's title template (`app/layout.tsx`: `"Mermaid - %s"`) — set `metadata.title` as a plain string per page rather than duplicating the "Mermaid - " prefix.

**Root layout** (`app/layout.tsx`) wraps every route in `ThemeProvider` (`components/layout/theme-provider.tsx`, `next-themes` with `attribute="class"`) and a `flex min-h-svh flex-col` shell: `Navbar` → `<main className="mx-auto w-full max-w-6xl ...">` → `Footer`. The `max-w-6xl` on `<main>` is intentionally kept identical to the inner content wrapper in `Navbar` so page content lines up with the nav bar at all viewport widths — preserve that when touching either file.

**Mermaid rendering** (`components/mermaid/`): `mermaid-editor.tsx` is the client-side orchestrator — it debounces textarea input (`hooks/use-debounced-value.ts`, ~300ms), lazy-loads the `mermaid` module once (module-scoped cached promise, not per-render), re-runs `mermaid.initialize()` + `mermaid.render()` together whenever the debounced code or the resolved theme changes (mermaid caches theme state per `initialize` call, so both must fire together), and guards against out-of-order async renders with an `ignore` flag set in the effect cleanup. On parse/render failure it shows the error inline but **keeps the last successfully rendered SVG on screen** rather than clearing it — preserve this behavior, it's deliberate UX, not an oversight.

**Theme toggle**: `components/layout/navbar.tsx` reads/writes theme via `next-themes`' `useTheme()` directly (no separate toggle component) and uses `hooks/use-is-client.ts` (a `useSyncExternalStore` mount check) to avoid rendering the wrong sun/moon icon before hydration settles.

**Editor toolbar** (`components/mermaid/`), all siblings composed by `mermaid-editor.tsx`:
- `mermaid-code-editor.tsx` — CodeMirror 6 (`@uiw/react-codemirror`) with `codemirror-lang-mermaid` for syntax highlighting and `oneDark`/`"light"` theme synced to `resolvedTheme`. Not all Mermaid diagram types have real grammar support in `codemirror-lang-mermaid` (flowchart, sequence, gantt, pie, mindmap, journey, requirement) — class/state diagrams still edit fine, just without tailored highlighting.
- `sample-diagrams-menu.tsx` — a `DropdownMenu`, not a shadcn `Select`. A `Select` was tried first but base-ui's `Select.Root<Value>` can't infer its `Value` generic from the `items` prop (typed `any` there) without also passing a controlled `value`/`defaultValue`, which produced `Value = {}` and a type error on `onValueChange`. `DropdownMenu` sidesteps that entirely. The trigger label reflects the currently-selected sample (`value` prop from the parent's `selectedSampleId` state) rather than a static "Sample diagrams" placeholder — a plain action menu that always showed the same label looked broken/unresponsive.
- `mermaid-actions.tsx` — copy code, download SVG, download PNG, reset to default sample. **Known limitation**: PNG export rasterizes the SVG through `new Image()` + `<canvas>`, and `canvas.toBlob()` throws `"Tainted canvases may not be exported"` for any diagram whose SVG contains a `<foreignObject>` (Mermaid uses these for HTML-based text labels in several diagram types, e.g. class diagrams) — this is a browser security restriction on `drawImage()` with foreignObject content, not a bug in this code, and isn't fixable by tweaking blob/data URLs. A real fix needs either stripping/rasterizing `foreignObject` content before serializing, or configuring Mermaid with `htmlLabels: false` (loses text-wrapping quality) to avoid foreignObject altogether.
- `mermaid-preview.tsx` — adds pan/zoom on top of the SVG rendering from the earlier section: `scale`/`pan` state, wheel-to-zoom-toward-cursor, pointer-drag-to-pan (via `setPointerCapture`), and explicit zoom in/out/reset-view buttons. The wheel listener is attached with a manual `container.addEventListener("wheel", handler, { passive: false })` in a `useEffect`, **not** a React `onWheel` prop — React's synthetic wheel handler can't reliably `preventDefault()` since v17 attaches it as a passive root listener, so `onWheel` alone won't stop page scroll. Takes a `resetViewKey: number` prop from the parent; incrementing it (on sample-load or explicit reset) re-centers and resets zoom without fighting the user's pan/zoom during normal edits — edits alone never reset the view.

## shadcn/ui: base-ui, not Radix

This project's shadcn style uses `@base-ui/react` primitives, whose API differs from the more common Radix-based shadcn output (see `.agents/skills/shadcn/rules/base-vs-radix.md` for the full list — Select, ToggleGroup, Slider, Accordion, etc. all differ). The two that come up immediately with the components already in this repo:

- Polymorphic rendering uses the **`render`** prop, not `asChild`:
  ```tsx
  <Button render={<Link href="/editor" />} nativeButton={false}>Open Editor</Button>
  ```
- Whenever `render` swaps in a non-`<button>` element (a link, a div, etc.), you **must** also pass `nativeButton={false}`, or Base UI logs an accessibility warning at runtime.

Icons come from `lucide-react` (the configured `iconLibrary`). Inside `Button`/other shadcn components, icons take a `data-icon="inline-start"` or `data-icon="inline-end"` attribute instead of margin/sizing utility classes — sizing is handled by the component's own CSS.
