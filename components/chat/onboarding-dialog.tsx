"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { LANGUAGES, SCHOOL_LEVELS, SchoolLevel, AppLanguage } from "@/lib/types";
import { GraduationCap } from "lucide-react";

export function OnboardingDialog() {
  const { preferences, completeOnboarding } = useAppStore();
  const [level, setLevel] = useState<SchoolLevel>("6e");
  const [language, setLanguage] = useState<AppLanguage>("fr");

  const open = !preferences.onboardingComplete;

  return (
    <Dialog open={open}>
      <DialogContent hideClose className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">Bienvenue sur EduIA</DialogTitle>
          <DialogDescription className="text-center">
            Choisis ton niveau scolaire et ta langue pour commencer. Tu pourras les modifier
            à tout moment dans les paramètres.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Niveau scolaire</label>
            <Select value={level} onValueChange={(v) => setLevel(v as SchoolLevel)}>
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
            <label className="text-sm font-medium">Langue</label>
            <Select value={language} onValueChange={(v) => setLanguage(v as AppLanguage)}>
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
        </div>

        <Button size="lg" className="w-full" onClick={() => completeOnboarding(level, language)}>
          Commencer
        </Button>
      </DialogContent>
    </Dialog>
  );
}
