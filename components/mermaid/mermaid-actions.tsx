"use client";

import {
  Check,
  Copy,
  Download,
  Image as ImageIcon,
  RotateCcw
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";

interface MermaidActionsProps {
  code: string;
  svg: string | null;
  onReset: () => void;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadSvg(svg: string) {
  downloadBlob(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
    "diagram.svg"
  );
}

async function downloadPng(svg: string) {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load diagram image"));
      img.src = url;
    });

    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );
    if (pngBlob) {
      downloadBlob(pngBlob, "diagram.png");
    }
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function MermaidActions({ code, svg, onReset }: MermaidActionsProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) {
      return;
    }
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
  }

  async function handleDownloadPng() {
    if (svg) {
      await downloadPng(svg);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Copy code"
        onClick={handleCopy}
      >
        {copied ? <Check /> : <Copy />}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Download SVG"
        disabled={!svg}
        onClick={() => svg && downloadSvg(svg)}
      >
        <Download />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Download PNG"
        disabled={!svg}
        onClick={handleDownloadPng}
      >
        <ImageIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Reset to sample"
        onClick={onReset}
      >
        <RotateCcw />
      </Button>
    </div>
  );
}
