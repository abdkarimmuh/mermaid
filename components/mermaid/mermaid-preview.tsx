"use client";

import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

interface MermaidPreviewProps {
  svg: string | null;
  error: string | null;
  resetViewKey: number;
}

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const ZOOM_STEP = 1.2;

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function MermaidPreview({
  svg,
  error,
  resetViewKey
}: MermaidPreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const dragState = React.useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const centerView = React.useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    setScale(1);
    setPan({
      x: (containerRect.width - contentRect.width) / 2,
      y: (containerRect.height - contentRect.height) / 2
    });
  }, []);

  const centeredOnMountRef = React.useRef(false);
  React.useEffect(() => {
    if (centeredOnMountRef.current || svg === null) {
      return;
    }
    centeredOnMountRef.current = true;
    centerView();
  }, [svg, centerView]);

  const skipFirstResetRef = React.useRef(true);
  React.useEffect(() => {
    if (skipFirstResetRef.current) {
      skipFirstResetRef.current = false;
      return;
    }
    centerView();
  }, [resetViewKey, centerView]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    function onWheel(event: WheelEvent) {
      event.preventDefault();
      const rect = container!.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const factor = event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP;

      setScale((prevScale) => {
        const nextScale = clampScale(prevScale * factor);
        setPan((prevPan) => ({
          x: mouseX - ((mouseX - prevPan.x) / prevScale) * nextScale,
          y: mouseY - ((mouseY - prevPan.y) / prevScale) * nextScale
        }));
        return nextScale;
      });
    }

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, []);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current) {
      return;
    }
    const { startX, startY, originX, originY } = dragState.current;
    setPan({
      x: originX + (event.clientX - startX),
      y: originY + (event.clientY - startY)
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    dragState.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="border-input relative flex min-h-64 flex-1 flex-col overflow-hidden rounded-md border md:w-1/2">
      {error ? (
        <pre className="border-destructive/40 bg-destructive/10 text-destructive absolute top-2 right-2 left-2 z-10 max-h-40 overflow-auto rounded-md border p-3 text-xs whitespace-pre-wrap">
          {error}
        </pre>
      ) : null}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="flex-1 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
      >
        {svg ? (
          <div
            ref={contentRef}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "0 0"
            }}
            className="inline-block [&_svg]:h-auto [&_svg]:max-w-none"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <p className="text-muted-foreground p-4 text-sm">Rendering…</p>
        )}
      </div>
      <div className="bg-background/80 border-input absolute right-2 bottom-2 flex items-center gap-1 rounded-md border p-1 backdrop-blur">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom out"
          onClick={() => setScale((prev) => clampScale(prev / ZOOM_STEP))}
        >
          <ZoomOut />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Reset view"
          onClick={centerView}
        >
          <Maximize2 />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Zoom in"
          onClick={() => setScale((prev) => clampScale(prev * ZOOM_STEP))}
        >
          <ZoomIn />
        </Button>
      </div>
    </div>
  );
}
