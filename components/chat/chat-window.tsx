"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { useAppStore } from "@/lib/store";
import { ChatMessage } from "@/lib/types";
import { Message } from "./message";
import { ChatInput, PendingAttachment } from "./chat-input";
import { GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";

const SUGGESTIONS = [
  "Explique-moi le théorème de Pythagore",
  "Résume la Révolution française",
  "Aide-moi à conjuguer le verbe être au présent",
  "Comment équilibrer une équation chimique ?"
];

export interface ChatWindowHandle {
  sendMessage: (text: string) => void;
}

export const ChatWindow = forwardRef<ChatWindowHandle, { onOpenVoiceMode: () => void }>(function ChatWindow(
  { onOpenVoiceMode },
  ref
) {
  const {
    conversations,
    activeConversationId,
    newConversation,
    addMessage,
    updateMessage,
    removeMessage,
    preferences
  } = useAppStore();

  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages.length, isStreaming]);

  const ensureConversation = () => {
    if (activeConversationId) return activeConversationId;
    return newConversation();
  };

  const streamAssistantReply = async (conversationId: string, history: ChatMessage[]) => {
    const assistantId = uuid();
    addMessage(conversationId, {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString()
    });
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          level: preferences.level,
          language: preferences.language,
          responseMode: preferences.responseMode
        })
      });

      if (!res.ok || !res.body) throw new Error("Réponse du serveur invalide");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        updateMessage(conversationId, assistantId, full);
      }
    } catch (err) {
      console.error(err);
      removeMessage(conversationId, assistantId);
      toast.error(
        "Impossible de contacter EduIA. Vérifie que GEMINI_API_KEY est configurée dans .env.local."
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const analyzeAttachment = async (conversationId: string, question: string, attachment: PendingAttachment) => {
    const assistantId = uuid();
    addMessage(conversationId, {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString()
    });
    setIsStreaming(true);

    try {
      const formData = new FormData();
      formData.append("file", attachment.file);
      formData.append("question", question || "Analyse ce document et explique-le clairement.");
      formData.append("level", preferences.level);
      formData.append("language", preferences.language);
      formData.append("responseMode", preferences.responseMode);

      const res = await fetch("/api/chat/analyze", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur d'analyse");
      updateMessage(conversationId, assistantId, data.answer);
    } catch (err: any) {
      console.error(err);
      updateMessage(conversationId, assistantId, err.message || "Erreur lors de l'analyse du document.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSend = async (text: string, attachments: PendingAttachment[]) => {
    const conversationId = ensureConversation();

    const userMessage: ChatMessage = {
      id: uuid(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
      attachments: attachments.map(({ file, ...a }) => a)
    };
    addMessage(conversationId, userMessage);

    if (attachments.length > 0) {
      await analyzeAttachment(conversationId, text, attachments[0]);
      return;
    }

    const current = useAppStore.getState().conversations.find((c) => c.id === conversationId);
    const history = [...(current?.messages ?? []), userMessage];
    await streamAssistantReply(conversationId, history);
  };

  const handleRegenerate = async () => {
    if (!conversation) return;
    const messages = conversation.messages;
    const lastAssistantIndex = [...messages].reverse().findIndex((m) => m.role === "assistant");
    if (lastAssistantIndex === -1) return;
    const idx = messages.length - 1 - lastAssistantIndex;
    const toRemove = messages[idx];
    removeMessage(conversation.id, toRemove.id);
    await streamAssistantReply(conversation.id, messages.slice(0, idx));
  };

  const handleQuickAction = async (instruction: string) => {
    if (!conversation) return;
    const conversationId = conversation.id;
    const userMessage: ChatMessage = {
      id: uuid(),
      role: "user",
      content: instruction,
      createdAt: new Date().toISOString()
    };
    addMessage(conversationId, userMessage);
    const history = [...conversation.messages, userMessage];
    await streamAssistantReply(conversationId, history);
  };

  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      toast.error("La lecture vocale n'est pas supportée par ce navigateur.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = preferences.language === "ar" ? "ar-SA" : preferences.language === "en" ? "en-US" : "fr-FR";
    window.speechSynthesis.speak(utterance);
  };

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string) => {
      handleSend(text, []);
    }
  }));

return (
  <div className="relative flex h-full flex-col bg-background">

    {/* Messages Area */}
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto scroll-smooth px-4 py-6 scrollbar-thin"
    >
      {!conversation || conversation.messages.length === 0 ? (
        <div className="flex min-h-full flex-col items-center justify-center px-4 text-center">

          {/* Logo */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 shadow-sm">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour, je suis EduIA 👋
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Ton assistant scolaire intelligent.
            Pose une question et je t’aide à comprendre tes cours.
          </p>

          <div className="mt-2 text-xs text-muted-foreground">
            Niveau : {preferences.level}
          </div>


          {/* Suggestions */}
          <div className="mt-8 grid w-full max-w-xl gap-3 sm:grid-cols-2">

            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion, [])}
                className="
                  group flex items-start gap-3 rounded-2xl
                  border border-border/60
                  bg-card/70
                  p-4
                  text-left text-sm
                  shadow-sm
                  transition-all
                  hover:-translate-y-0.5
                  hover:border-primary/40
                  hover:bg-accent
                "
              >

                <div className="
                  mt-0.5 flex h-7 w-7 shrink-0
                  items-center justify-center
                  rounded-lg bg-primary/10
                ">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>


                <span className="leading-relaxed">
                  {suggestion}
                </span>

              </button>
            ))}

          </div>

        </div>

      ) : (

        <div className="
          mx-auto
          w-full
          max-w-6xl
          space-y-6
          pb-8
        ">

          {conversation.messages.map((message, index) => (

            <Message
              key={message.id}
              message={message}
              isLast={index === conversation.messages.length - 1}

              onRegenerate={
                message.role === "assistant" &&
                index === conversation.messages.length - 1
                  ? handleRegenerate
                  : undefined
              }

              onSpeak={handleSpeak}
              onQuickAction={handleQuickAction}
            />

          ))}

        </div>

      )}

    </div>


    {/* Input Area */}
    <div className="
      sticky
      bottom-0
      border-t
      border-border/50
      bg-background/80
      px-4
      py-3
      backdrop-blur-xl
    ">
      <div className="mx-auto max-w-6xl">
        <ChatInput
          onSend={handleSend}
          disabled={isStreaming}
          onOpenVoiceMode={onOpenVoiceMode}
        />
      </div>
    </div>


  </div>
);
});
