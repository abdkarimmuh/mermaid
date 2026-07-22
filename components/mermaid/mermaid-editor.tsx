"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { MermaidActions } from "@/components/mermaid/mermaid-actions";
import { MermaidCodeEditor } from "@/components/mermaid/mermaid-code-editor";
import { MermaidPreview } from "@/components/mermaid/mermaid-preview";
import { SampleDiagramsMenu } from "@/components/mermaid/sample-diagrams-menu";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { DEFAULT_DIAGRAM, MERMAID_SAMPLES } from "@/lib/mermaid/samples";

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
  const [selectedSampleId, setSelectedSampleId] = React.useState(
    MERMAID_SAMPLES[0].id
  );
  const [svg, setSvg] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [resetViewKey, setResetViewKey] = React.useState(0);
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

  function handleSelectSample(sampleId: string) {
    const sample = MERMAID_SAMPLES.find((item) => item.id === sampleId);
    if (sample) {
      setCode(sample.code);
      setSelectedSampleId(sample.id);
      setResetViewKey((key) => key + 1);
    }
  }

  function handleReset() {
    setCode(DEFAULT_DIAGRAM);
    setSelectedSampleId(MERMAID_SAMPLES[0].id);
    setResetViewKey((key) => key + 1);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SampleDiagramsMenu
          value={selectedSampleId}
          onSelect={handleSelectSample}
        />
        <MermaidActions code={code} svg={svg} onReset={handleReset} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row">
        <MermaidCodeEditor value={code} onChange={setCode} />
        <MermaidPreview svg={svg} error={error} resetViewKey={resetViewKey} />
      </div>
    </div>
  );
}
