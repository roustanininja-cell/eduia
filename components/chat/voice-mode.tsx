"use client";

import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Mic, X } from "lucide-react";
import { toast } from "sonner";

type VoiceState = "idle" | "listening" | "thinking" | "speaking";

export function VoiceMode({ onClose }: { onClose: () => void }) {
  const { activeConversationId, newConversation, addMessage, preferences } = useAppStore();
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const langCode = preferences.language === "ar" ? "ar-SA" : preferences.language === "en" ? "en-US" : "fr-FR";

  const stopEverything = () => {
    try {
      recognitionRef.current?.stop();
    } catch (e) {
      console.log("Recognition stop ignored", e);
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setState("idle");
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.onend = () => setState("idle");
    utteranceRef.current = utterance;
    setState("speaking");
    window.speechSynthesis.speak(utterance);
  };

  const askAssistant = async (question: string) => {
    setState("thinking");
    const conversationId = activeConversationId ?? newConversation();
    addMessage(conversationId, {
      id: uuid(),
      role: "user",
      content: question,
      createdAt: new Date().toISOString()
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: question }],
          level: preferences.level,
          language: preferences.language,
          responseMode: "courte"
        })
      });
      if (!res.ok || !res.body) throw new Error("Erreur serveur");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
      }
      addMessage(conversationId, {
        id: uuid(),
        role: "assistant",
        content: full,
        createdAt: new Date().toISOString()
      });
      speak(full);
    } catch (err) {
      toast.error("Impossible de contacter l'assistant vocal.");
      setState("idle");
    }
  };

  const startListening = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("La reconnaissance vocale n'est pas supportée par ce navigateur ou est bloquée par vos paramètres de confidentialité (Brave Shields).");
      return;
    }
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langCode;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results).map((r: any) => r[0].transcript).join("");
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          toast.error("Accès micro refusé. Veuillez vérifier les permissions de votre navigateur.");
        } else if (event.error === "network") {
          toast.error("Erreur réseau de reconnaissance vocale.");
        }
        stopEverything();
      };

      recognition.onend = () => {
        setTranscript((current) => {
          if (current.trim()) {
            askAssistant(current.trim());
          } else {
            setState("idle");
          }
          return current;
        });
      };

      recognition.start();
      recognitionRef.current = recognition;
      setTranscript("");
      setState("listening");
    } catch (e) {
      console.error("Failed to start recognition:", e);
      toast.error("Impossible d'activer le micro.");
      setState("idle");
    }
  };

  useEffect(() => {
    return () => stopEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMicPress = () => {
    if (state === "speaking") {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      startListening();
      return;
    }
    if (state === "listening") {
      recognitionRef.current?.stop();
      return;
    }
    startListening();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => { stopEverything(); onClose(); }}>
        <X className="h-5 w-5" />
      </Button>

      <div className="relative flex h-40 w-40 items-center justify-center">
        {(state === "listening" || state === "speaking") && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary/30 animate-pulse-ring animate-ping" />
        )}
        <button
          onClick={handleMicPress}
          className={cn(
            "relative flex h-28 w-28 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-colors",
            state === "listening" && "bg-primary",
            state === "speaking" && "bg-emerald-500",
            state === "thinking" && "bg-muted-foreground animate-pulse",
            state === "idle" && "bg-primary/80 hover:bg-primary"
          )}
        >
          <Mic className="h-10 w-10" />
        </button>
      </div>

      <p className="mt-8 max-w-sm text-center text-sm text-muted-foreground px-4">
        {state === "idle" && "Appuie sur le micro pour parler à EduIA"}
        {state === "listening" && (transcript || "Je t'écoute…")}
        {state === "thinking" && "EduIA réfléchit…"}
        {state === "speaking" && "EduIA te répond — appuie pour l'interrompre"}
      </p>
    </div>
  );
}