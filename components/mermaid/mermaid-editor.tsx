"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { MermaidCodeInput } from "@/components/mermaid/mermaid-code-input";
import { MermaidPreview } from "@/components/mermaid/mermaid-preview";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { DEFAULT_DIAGRAM } from "@/lib/mermaid/default-diagram";

let mermaidModulePromise: Promise<typeof import("mermaid")> | null = null;

function loadMermaid() {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import("mermaid");
  }
  return mermaidModulePromise;
}

let renderCount = 0;

export function MermaidEditor() {
  const { resolvedTheme } = useTheme();
  const [code, setCode] = React.useState(DEFAULT_DIAGRAM);
  const [svg, setSvg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const debouncedCode = useDebouncedValue(code, 300);

  React.useEffect(() => {
    let ignore = false;

    async function run() {
      try {
        const { default: mermaid } = await loadMermaid();
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: resolvedTheme === "dark" ? "dark" : "default"
        });
        await mermaid.parse(debouncedCode);
        const { svg: rendered } = await mermaid.render(
          `mermaid-${++renderCount}`,
          debouncedCode
        );
        if (!ignore) {
          setSvg(rendered);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    }

    run();

    return () => {
      ignore = true;
    };
  }, [debouncedCode, resolvedTheme]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
      <MermaidCodeInput value={code} onChange={setCode} />
      <MermaidPreview svg={svg} error={error} />
    </div>
  );
}
