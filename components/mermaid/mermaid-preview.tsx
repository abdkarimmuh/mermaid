interface MermaidPreviewProps {
  svg: string | null;
  error: string | null;
}

export function MermaidPreview({ svg, error }: MermaidPreviewProps) {
  return (
    <div className="flex min-h-64 flex-1 flex-col gap-2 overflow-auto rounded-md border border-input p-4 md:w-1/2">
      {error ? (
        <pre className="overflow-auto rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs whitespace-pre-wrap text-destructive">
          {error}
        </pre>
      ) : null}
      {svg ? (
        <div
          className="flex flex-1 items-center justify-center [&_svg]:h-auto [&_svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <p className="text-muted-foreground text-sm">Rendering…</p>
      )}
    </div>
  );
}
