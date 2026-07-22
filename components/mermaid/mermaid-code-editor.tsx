"use client";

import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { mermaid as mermaidLanguage } from "codemirror-lang-mermaid";
import { useTheme } from "next-themes";

import { useIsClient } from "@/hooks/use-is-client";

interface MermaidCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const EXTENSIONS = [mermaidLanguage()];

export function MermaidCodeEditor({ value, onChange }: MermaidCodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="border-input min-h-64 flex-1 overflow-hidden rounded-md border md:w-1/2">
      <CodeMirror
        value={value}
        onChange={onChange}
        theme={isDark ? oneDark : "light"}
        extensions={EXTENSIONS}
        height="100%"
        style={{ height: "100%", fontSize: "0.75rem" }}
        basicSetup={{ foldGutter: false }}
      />
    </div>
  );
}
