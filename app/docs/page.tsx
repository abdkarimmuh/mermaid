import { Metadata } from "next";

interface DocSection {
  title: string;
  description: string;
  example: string;
}

const SECTIONS: DocSection[] = [
  {
    title: "Flowchart",
    description: "Draws a process flow with nodes and directed arrows.",
    example: `flowchart TD
    A[Start] --> B{Condition?}
    B -- Yes --> C[Done]
    B -- No --> A`
  },
  {
    title: "Sequence Diagram",
    description:
      "Shows the order of interactions between participants/systems.",
    example: `sequenceDiagram
    participant User
    participant Server
    User->>Server: Send request
    Server-->>User: Send response`
  },
  {
    title: "Class Diagram",
    description: "Describes a class structure and its relationships.",
    example: `classDiagram
    class Animal {
      +String name
      +makeSound()
    }
    class Dog
    Animal <|-- Dog`
  },
  {
    title: "State Diagram",
    description: "Shows transitions between the states of a system.",
    example: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading
    Loading --> Success
    Loading --> Error
    Success --> [*]`
  },
  {
    title: "Gantt Chart",
    description: "Displays a project's schedule and task durations.",
    example: `gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    section Phase 1
    Research    :a1, 2026-01-01, 5d
    Design      :after a1, 5d`
  },
  {
    title: "Pie Chart",
    description: "Displays data proportions as a pie chart.",
    example: `pie title Browser Distribution
    "Chrome" : 65
    "Firefox" : 15
    "Safari" : 20`
  }
];

export const metadata: Metadata = {
  title: "Docs"
};

export default function DocsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-medium">Mermaid Syntax Cheatsheet</h1>
        <p className="text-muted-foreground text-sm">
          A quick reference for the diagram types Mermaid supports. Copy an
          example below into the Editor page to try it out.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {SECTIONS.map((section) => (
          <section
            key={section.title}
            className="border-input flex flex-col gap-2 rounded-md border p-4"
          >
            <h2 className="text-sm font-medium">{section.title}</h2>
            <p className="text-muted-foreground text-xs">
              {section.description}
            </p>
            <pre className="bg-muted overflow-auto rounded-md p-3 font-mono text-xs">
              <code>{section.example}</code>
            </pre>
          </section>
        ))}
      </div>
    </div>
  );
}
