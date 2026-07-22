import { Metadata } from "next";

import { MermaidEditor } from "@/components/mermaid/mermaid-editor";

export const metadata: Metadata = {
  title: "Editor"
};

export default function AppPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
      <h1 className="text-sm font-medium">Mermaid Live Editor</h1>
      <MermaidEditor />
    </div>
  );
}
