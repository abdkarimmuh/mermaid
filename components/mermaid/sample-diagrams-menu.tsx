"use client";

import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MERMAID_SAMPLES } from "@/lib/mermaid/samples";

interface SampleDiagramsMenuProps {
  value: string;
  onSelect: (sampleId: string) => void;
}

export function SampleDiagramsMenu({
  value,
  onSelect
}: SampleDiagramsMenuProps) {
  const selected = MERMAID_SAMPLES.find((sample) => sample.id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        {selected?.label ?? "Sample diagrams"}
        <ChevronDown data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {MERMAID_SAMPLES.map((sample) => (
          <DropdownMenuItem key={sample.id} onClick={() => onSelect(sample.id)}>
            {sample.label}
            {sample.id === value ? <Check data-icon="inline-end" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
