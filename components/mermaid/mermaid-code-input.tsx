"use client";

import { Textarea } from "@/components/ui/textarea";

interface MermaidCodeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function MermaidCodeInput({ value, onChange }: MermaidCodeInputProps) {
  return (
    <Textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      spellCheck={false}
      aria-label="Mermaid diagram source"
      className="min-h-64 flex-1 resize-none font-mono text-xs md:w-1/2"
    />
  );
}
