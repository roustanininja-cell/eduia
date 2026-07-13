"use client";


import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MathToolbar } from "./math-toolbar";
import { Attachment } from "@/lib/types";
import { ArrowUp, FileText, ImageIcon, Mic, Sigma, Square, X } from "lucide-react";
import { toast } from "sonner";

export interface PendingAttachment extends Attachment {
  file: File;
}

export function ChatInput({
  onSend,
  disabled,
  onOpenVoiceMode
}: {
  onSend: (text: string, attachments: PendingAttachment[]) => void;
  disabled?: boolean;
  onOpenVoiceMode: () => void;
}) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [listening, setListening] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleFiles = (fileList: FileList | null, type: "image" | "pdf") => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const maxMb = type === "image" ? 10 : 20;
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(`Fichier trop volumineux (max ${maxMb} Mo)`);
      return;
    }
    const url = URL.createObjectURL(file);
    setAttachments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), type, name: file.name, url, file }
    ]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSend = () => {
    if (!text.trim() && attachments.length === 0) return;
    onSend(text.trim(), attachments);
    setText("");
    setAttachments([]);
  };

  const insertSymbol = (symbol: string) => {
    const el = textareaRef.current;
    if (!el) {
      setText((t) => t + symbol);
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const next = text.slice(0, start) + symbol + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + symbol.length;
    });
  };

  const toggleDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("La reconnaissance vocale n'est pas supportée par ce navigateur.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setText(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  return (
  <div className="px-3 pb-4 sm:px-6">

    <div className="mx-auto max-w-3xl">

      {showMath && (
        <div className="mb-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <MathToolbar onInsert={insertSymbol} />
        </div>
      )}


      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">

          {attachments.map((a) => (
            <div
              key={a.id}
              className="
                group flex items-center gap-2
                rounded-xl
                border border-border/70
                bg-card
                px-3 py-2
                text-xs
                shadow-sm
                transition
                hover:border-primary/40
              "
            >

              <div className="
                flex h-6 w-6 items-center justify-center
                rounded-lg bg-primary/10
              ">
                {a.type === "image"
                  ? <ImageIcon className="h-3.5 w-3.5 text-primary" />
                  : <FileText className="h-3.5 w-3.5 text-primary" />
                }
              </div>


              <span className="max-w-[160px] truncate">
                {a.name}
              </span>


              <button
                onClick={() => removeAttachment(a.id)}
                className="
                  rounded-full
                  p-1
                  text-muted-foreground
                  hover:bg-muted
                  hover:text-foreground
                "
              >
                <X className="h-3.5 w-3.5" />
              </button>

            </div>
          ))}

        </div>
      )}


      <div
        className="
          flex items-end gap-2
          rounded-[28px]
          border border-border/70
          bg-card/90
          p-3
          shadow-lg
          backdrop-blur-xl
          transition-all
          focus-within:border-primary/50
          focus-within:ring-4
          focus-within:ring-primary/10
        "
      >

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, "image")}
        />

        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files, "pdf")}
        />


        <div className="flex items-center gap-1">

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10"
            onClick={() => imageInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>


          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10"
            onClick={() => pdfInputRef.current?.click()}
          >
            <FileText className="h-5 w-5" />
          </Button>


          <Button
            type="button"
            variant={showMath ? "secondary" : "ghost"}
            size="icon"
            className="rounded-full"
            onClick={() => setShowMath((v) => !v)}
          >
            <Sigma className="h-5 w-5" />
          </Button>

        </div>



        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Pose ta question à EduIA..."
          rows={1}
          className="
            min-h-[44px]
            max-h-40
            flex-1
            resize-none
            border-none
            bg-transparent
            px-2
            py-3
            shadow-none
            focus-visible:ring-0
          "
        />



        <Button
          type="button"
          variant={listening ? "destructive" : "ghost"}
          size="icon"
          className="rounded-full"
          onClick={toggleDictation}
        >
          {listening
            ? <Square className="h-4 w-4"/>
            : <Mic className="h-5 w-5"/>
          }
        </Button>



        <Button
          type="button"
          size="icon"
          disabled={
            disabled ||
            (!text.trim() && attachments.length === 0)
          }
          className="
            rounded-full
            bg-primary
            text-primary-foreground
            shadow-md
            transition
            hover:scale-105
          "
          onClick={handleSend}
        >
          <ArrowUp className="h-5 w-5"/>
        </Button>


      </div>



      <div className="
        mt-3
        flex
        flex-col
        items-center
        justify-center
        gap-1
        text-center
        sm:flex-row
        sm:gap-4
      ">

        <button
          onClick={onOpenVoiceMode}
          className="
            text-xs
            text-muted-foreground
            transition
            hover:text-primary
          "
        >
          🎙️ Mode vocal
        </button>


        <p className="text-xs text-muted-foreground">
          EduIA peut faire des erreurs. Vérifie les informations importantes.
        </p>

      </div>


    </div>

  </div>
);
}
