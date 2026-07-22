export interface MermaidSample {
  id: string;
  label: string;
  code: string;
}

export const MERMAID_SAMPLES: MermaidSample[] = [
  {
    id: "flowchart",
    label: "Flowchart",
    code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B
`
  },
  {
    id: "sequence",
    label: "Sequence Diagram",
    code: `sequenceDiagram
    participant User
    participant Server
    User->>Server: Send request
    Server-->>User: Send response
`
  },
  {
    id: "class",
    label: "Class Diagram",
    code: `classDiagram
    class Animal {
      +String name
      +makeSound()
    }
    class Dog
    Animal <|-- Dog
`
  },
  {
    id: "state",
    label: "State Diagram",
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading
    Loading --> Success
    Loading --> Error
    Success --> [*]
`
  },
  {
    id: "gantt",
    label: "Gantt Chart",
    code: `gantt
    title Project Schedule
    dateFormat  YYYY-MM-DD
    section Phase 1
    Research    :a1, 2026-01-01, 5d
    Design      :after a1, 5d
`
  },
  {
    id: "pie",
    label: "Pie Chart",
    code: `pie title Browser Distribution
    "Chrome" : 65
    "Firefox" : 15
    "Safari" : 20
`
  }
];

export const DEFAULT_DIAGRAM = MERMAID_SAMPLES[0].code;
