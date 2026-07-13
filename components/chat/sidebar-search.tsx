"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SidebarSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function SidebarSearch({
  value,
  onChange,
}: SidebarSearchProps) {
  return (
    <div className="px-5 py-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher une conversation..."
          className="
            h-11
            rounded-xl
            border
            border-border/50
            bg-secondary/50
            pl-11
            text-sm
            transition-all
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        />
      </div>
    </div>
  );
}