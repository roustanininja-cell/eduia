"use client";

import { useTheme } from "next-themes";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { AppLanguage, LANGUAGES, RESPONSE_MODES, ResponseMode, SCHOOL_LEVELS, SchoolLevel } from "@/lib/types";
import { Info, Minus, Plus, X } from "lucide-react";

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { preferences, setPreferences } = useAppStore();
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        hideClose
        className="inset-y-0 right-0 left-auto top-0 h-full w-full max-w-sm translate-x-0 translate-y-0 rounded-none border-l border-t-0 border-b-0 border-r-0 sm:max-w-sm"
      >
        <div className="flex items-center justify-between">
          <DialogTitle className="text-lg">Paramètres</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <Label>Niveau scolaire</Label>
            <Select value={preferences.level} onValueChange={(v) => setPreferences({ level: v as SchoolLevel })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCHOOL_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Langue</Label>
            <Select
              value={preferences.language}
              onValueChange={(v) => setPreferences({ language: v as AppLanguage })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Mode de réponse</Label>
            <Select
              value={preferences.responseMode}
              onValueChange={(v) => setPreferences({ responseMode: v as ResponseMode })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESPONSE_MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Lecture vocale</Label>
              <p className="text-xs text-muted-foreground">Propose d'écouter chaque réponse.</p>
            </div>
            <Switch
              checked={preferences.voiceReadingEnabled}
              onCheckedChange={(v) => setPreferences({ voiceReadingEnabled: v })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Taille du texte</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPreferences({ fontSize: "sm" })}
                className={preferences.fontSize === "sm" ? "border-primary text-primary" : ""}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <div className="flex h-9 flex-1 items-center justify-center rounded-lg border border-input text-sm">
                {preferences.fontSize === "sm" ? "Petit" : preferences.fontSize === "lg" ? "Grand" : "Moyen"}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPreferences({ fontSize: "lg" })}
                className={preferences.fontSize === "lg" ? "border-primary text-primary" : ""}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Thème</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme(t)}
                >
                  {t === "light" ? "Clair" : t === "dark" ? "Sombre" : "Système"}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              EduIA est une application personnelle : tes conversations et préférences restent
              stockées uniquement sur cet appareil (IndexedDB), rien n'est envoyé à un serveur
              distant en dehors de la génération des réponses.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
