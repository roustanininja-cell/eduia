"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, FileText, ListChecks, NotebookPen } from "lucide-react";

const ACTIONS = [
  {
    icon: NotebookPen,
    label: "Fiche de cours",
    build: (topic: string) => `Crée une fiche de cours claire et structurée sur : ${topic}.`
  },
  {
    icon: FileText,
    label: "Résumé",
    build: (topic: string) => `Fais-moi un résumé synthétique de : ${topic}.`
  },
  {
    icon: Brain,
    label: "Flashcards",
    build: (topic: string) =>
      `Génère une série de flashcards (question / réponse) pour réviser : ${topic}.`
  },
  {
    icon: ListChecks,
    label: "Quiz",
    build: (topic: string) => `Crée un quiz de 5 questions à choix multiples sur : ${topic}, avec les corrections à la fin.`
  },
  {
    icon: BookOpen,
    label: "Plan de révision",
    build: (topic: string) => `Transforme ce sujet en plan de révision étape par étape : ${topic}.`
  }
];

export function RevisionPanel({
  open,
  onClose,
  onGenerate
}: {
  open: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => void;
}) {
  const [topic, setTopic] = useState("");

  const trigger = (build: (topic: string) => string) => {
    if (!topic.trim()) return;
    onGenerate(build(topic.trim()));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Mode Révision</DialogTitle>
          <DialogDescription>
            Indique un sujet ou colle le contenu d'un cours, puis choisis ce que tu veux générer.
          </DialogDescription>
        </DialogHeader>

        <Textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Ex : Les fonctions linéaires, La Révolution française, Le passé composé…"
          rows={4}
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ACTIONS.map((a) => (
            <Button
              key={a.label}
              variant="outline"
              className="h-auto flex-col gap-1.5 py-3"
              disabled={!topic.trim()}
              onClick={() => trigger(a.build)}
            >
              <a.icon className="h-4 w-4" />
              <span className="text-xs">{a.label}</span>
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Astuce : tu peux aussi envoyer un PDF de cours depuis le chat, puis demander ici de le résumer ou d'en faire un quiz.
        </p>
      </DialogContent>
    </Dialog>
  );
}
