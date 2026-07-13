"use client";

import { Button } from "@/components/ui/button";

const SYMBOLS: { label: string; insert: string }[] = [
  { label: "x²", insert: "^2" },
  { label: "x³", insert: "^3" },
  { label: "√", insert: "√(" },
  { label: "∛", insert: "∛(" },
  { label: "frac", insert: "(a/b)" },
  { label: "dfrac", insert: "(a/b)" },
  { label: "( )", insert: "()" },
  { label: "[ ]", insert: "[]" },
  { label: "| |", insert: "||" },
  { label: "π", insert: "π" },
  { label: "∞", insert: "∞" },
  { label: "∫", insert: "∫" },
  { label: "Σ", insert: "Σ" },
  { label: "≤", insert: "≤" },
  { label: "≥", insert: "≥" },
  { label: "=", insert: "=" },
  { label: "≠", insert: "≠" },
  { label: "≈", insert: "≈" },
  { label: "×", insert: "×" },
  { label: "÷", insert: "÷" },
  { label: "·", insert: "·" },
  { label: "%", insert: "%" }
];

export function MathToolbar({ onInsert }: { onInsert: (symbol: string) => void }) {
  return (
    <div className="mb-2 rounded-xl border border-border bg-card p-3 animate-slide-up">
      <p className="mb-2 text-xs font-medium text-muted-foreground">Outils mathématiques</p>
      <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-11">
        {SYMBOLS.map((s) => (
          <Button
            key={s.label}
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-0 font-mono text-xs"
            onClick={() => onInsert(s.insert)}
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
