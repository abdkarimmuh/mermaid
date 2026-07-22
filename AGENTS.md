<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mermaid Playground

A Next.js app for writing Mermaid diagrams and previewing them live. Routes: `/` (landing), `/editor` (live editor, `components/mermaid/mermaid-editor.tsx` — CodeMirror code editor, sample diagrams menu, copy/download actions, pan & zoom preview), `/docs` (syntax cheatsheet).

Uses shadcn/ui built on `@base-ui/react`, **not** Radix — polymorphic rendering uses the `render` prop (not `asChild`), and `nativeButton={false}` is required whenever `render` swaps in a non-`<button>` element. See `.agents/skills/shadcn/rules/base-vs-radix.md` for the full list of API differences.

Commands: `yarn dev`, `yarn build`, `yarn lint`, `yarn typecheck`, `yarn format`.

See `CLAUDE.md` for detailed architecture notes (Mermaid render lifecycle, theming, layout width coupling) and project-specific gotchas.
