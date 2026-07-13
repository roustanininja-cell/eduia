"use client";

import { Crown, Mic, Settings, User2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SidebarFooterProps {
  onOpenVoiceMode: () => void;
  onOpenSettings: () => void;
}

export function SidebarFooter({
  onOpenVoiceMode,
  onOpenSettings,
}: SidebarFooterProps) {
  return (
    <div className="border-t border-border/50 bg-background p-4">

      {/* Premium Card */}
      <div className="mb-4 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600 to-violet-600 p-4 text-white shadow-xl">

        <div className="mb-3 flex items-center gap-2">
          <Crown className="h-5 w-5" />

          <span className="font-semibold">
            EduIA Premium
          </span>
        </div>

        <p className="mb-4 text-xs text-blue-100">
          Faster AI, unlimited chats, voice mode and more.
        </p>

        <Button
          className="h-10 w-full rounded-xl bg-white text-blue-700 hover:bg-white/90"
        >
          Upgrade
        </Button>
      </div>

      {/* Voice Button */}
      <Button
        onClick={onOpenVoiceMode}
        variant="secondary"
        className="mb-2 h-12 w-full justify-start rounded-2xl"
      >
        <Mic className="mr-3 h-5 w-5" />
        Voice Mode
      </Button>

      {/* Settings */}
      <Button
        onClick={onOpenSettings}
        variant="ghost"
        className="mb-2 h-12 w-full justify-start rounded-2xl"
      >
        <Settings className="mr-3 h-5 w-5" />
        Settings
      </Button>

      {/* User */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white">

          <User2 className="h-5 w-5" />

        </div>

        <div className="flex-1">

          <p className="text-sm font-semibold">
            Student
          </p>

          <p className="text-xs text-muted-foreground">
            Free Plan
          </p>

        </div>

      </div>
    </div>
  );
}