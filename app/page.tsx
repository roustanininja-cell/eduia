"use client";

import { useEffect, useRef, useState } from "react";


import { Sidebar } from "@/components/chat/sidebar";
import { Topbar } from "@/components/chat/topbar";
import {
  ChatWindow,
  ChatWindowHandle,
} from "@/components/chat/chat-window";

import { OnboardingDialog } from "@/components/chat/onboarding-dialog";
import { RevisionPanel } from "@/components/chat/revision-panel";
import { SettingsDialog } from "@/components/chat/settings-dialog";
import { VoiceMode } from "@/components/chat/voice-mode";


import { useAppStore } from "@/lib/store";
import { ChatInput, PendingAttachment } from "@/components/chat/chat-input";

export default function Home() {
  const [hydrated, setHydrated] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const chatRef = useRef<ChatWindowHandle>(null);

  const {
    conversations,
    activeConversationId,
    newConversation,
  } = useAppStore();

  useEffect(() => {
    useAppStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!activeConversationId && conversations.length === 0) {
      newConversation();
    }
  }, [hydrated, activeConversationId, conversations.length, newConversation]);

  if (!hydrated) {
    return (
      <div className="flex h-screen">
        <Sidebar open={false} onClose={function (): void {
          throw new Error("Function not implemented.");
        } } onOpenSettings={function (): void {
          throw new Error("Function not implemented.");
        } } onOpenRevision={function (): void {
          throw new Error("Function not implemented.");
        } } onOpenVoiceMode={function (): void {
          throw new Error("Function not implemented.");
        } } />

        <main className="flex-1 flex flex-col w-full">
          <div className="flex-1 overflow-y-auto w-full">
            <div className="w-full px-6">
              {/* your messages / welcome screen */}
            </div>
          </div>

    <ChatInput onSend={function (text: string, attachments: PendingAttachment[]): void {
            throw new Error("Function not implemented.");
          } } onOpenVoiceMode={function (): void {
            throw new Error("Function not implemented.");
          } } />
  </main>
</div>
    );
  }

  return (
    <>
      <OnboardingDialog />

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <RevisionPanel
        open={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        onGenerate={(prompt) => chatRef.current?.sendMessage(prompt)}
      />

      {voiceOpen && (
        <VoiceMode onClose={() => setVoiceOpen(false)} />
      )}

      <main className="flex h-screen overflow-hidden bg-background">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenRevision={() => setRevisionOpen(true)}
          onOpenVoiceMode={() => setVoiceOpen(true)}
        />

        <section className="relative flex min-w-0 flex-1 flex-col bg-background">
          <Topbar
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          <div className="flex flex-1 overflow-hidden">
            <ChatWindow
              ref={chatRef}
              onOpenVoiceMode={() => setVoiceOpen(true)}
            />
          </div>
        </section>
      </main>
    </>
  );
}