"use client";

import { GraduationCap, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export function SidebarHeader({
  onNewChat,
}: SidebarHeaderProps) {
  return (
    <div className="border-b border-white/10 p-5">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Edu<span className="text-blue-500">IA</span>
          </h1>

          <p className="text-xs text-muted-foreground">
            Intelligent Assistant
          </p>
        </div>
      </div>

      <Button
        onClick={onNewChat}
        className="h-12 w-full justify-start rounded-2xl bg-blue-600 hover:bg-blue-700"
      >
        <PenSquare className="mr-2 h-4 w-4" />
        Nouveau Chat
      </Button>
    </div>
  );
}