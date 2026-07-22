import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-medium">Mermaid Playground</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        Write Mermaid diagrams and see the result rendered live in your browser.
      </p>
      <div className="flex items-center gap-3">
        <Button nativeButton={false} render={<Link href="/app" />}>
          Open Editor
        </Button>
        <Link
          href="/docs"
          className="text-muted-foreground hover:text-foreground text-sm underline underline-offset-4"
        >
          View Docs
        </Link>
      </div>
    </div>
  );
}
