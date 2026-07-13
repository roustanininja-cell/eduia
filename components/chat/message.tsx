"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import {
  Check,
  Copy,
  FileText,
  ImageIcon,
  RefreshCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Volume2
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Donner un autre exemple", instruction: "Donne-moi un autre exemple sur ce même sujet." },
  { label: "Créer un exercice similaire", instruction: "Crée un exercice similaire pour que je m'entraîne." },
  { label: "Expliquer autrement", instruction: "Peux-tu m'expliquer ça autrement, avec une autre approche ?" },
  { label: "Quiz sur ce sujet", instruction: "Propose-moi un petit quiz de 3 questions sur ce sujet." },
  { label: "Résumer", instruction: "Résume ce que tu viens d'expliquer en quelques points clés." }
];

export function Message({
  message,
  isLast,
  onRegenerate,
  onSpeak,
  onQuickAction
}: {
  message: ChatMessage;
  isLast?: boolean;
  onRegenerate?: () => void;
  onSpeak?: (text: string) => void;
  onQuickAction?: (instruction: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const isAssistant = message.role === "assistant";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
  <div className="group px-4 py-6">

    <div
      className={cn(
        "flex gap-4",
        !isAssistant && "flex-row-reverse"
      )}
    >


      {/* Avatar */}

      <Avatar className="mt-1 h-10 w-10 shrink-0">

        <AvatarFallback
          className={cn(
            "rounded-2xl",
            isAssistant
              ? "bg-primary text-primary-foreground"
              : "bg-secondary"
          )}
        >

          {isAssistant
            ?
            <Sparkles className="h-5 w-5"/>
            :
            "Y"
          }

        </AvatarFallback>

      </Avatar>





      <div
        className={cn(
          "min-w-0 max-w-[85%] space-y-2",
          !isAssistant &&
          "flex flex-col items-end"
        )}
      >



        {/* Name */}

        <div
          className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground",
            !isAssistant && "flex-row-reverse"
          )}
        >

          <span className="font-medium">
            {isAssistant ? "EduIA" : "Toi"}
          </span>


          <span>
            {formatDate(message.createdAt)}
          </span>

        </div>





        {/* Attachments */}

        {message.attachments &&
          message.attachments.length > 0 && (

          <div className="flex flex-wrap gap-2">

            {message.attachments.map((a)=>(

              <div
                key={a.id}
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-border/70
                  bg-card
                  px-3 py-2
                  text-xs
                  shadow-sm
                "
              >

                {a.type === "image"
                  ?
                  <ImageIcon className="h-4 w-4 text-primary"/>
                  :
                  <FileText className="h-4 w-4 text-primary"/>
                }


                <span className="max-w-[180px] truncate">
                  {a.name}
                </span>


              </div>

            ))}

          </div>

        )}






        {/* Message */}

        <div
          className={cn(

            "rounded-3xl px-5 py-3.5 text-sm leading-7 shadow-sm",

            isAssistant

            ?

            `
            border border-border/60
            bg-card
            prose
            prose-sm
            dark:prose-invert
            max-w-none

            prose-headings:font-semibold
            prose-pre:rounded-xl
            prose-pre:bg-muted
            prose-code:text-primary

            `

            :

            `
            rounded-tr-md
            bg-primary
            text-primary-foreground
            prose-invert
            `

          )}
        >

          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
              remarkMath
            ]}
            rehypePlugins={[
              rehypeKatex
            ]}
          >
            {message.content || "…"}
          </ReactMarkdown>


        </div>






        {/* Actions */}

        {isAssistant &&
          message.content && (

          <div
            className="
              flex items-center gap-1
              opacity-0
              transition-opacity
              group-hover:opacity-100
            "
          >

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleCopy}
            >

              {copied
                ?
                <Check className="h-4 w-4"/>
                :
                <Copy className="h-4 w-4"/>
              }

            </Button>



            {onRegenerate && (

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onRegenerate}
              >
                <RefreshCcw className="h-4 w-4"/>
              </Button>

            )}



            {onSpeak && (

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() =>
                  onSpeak(message.content)
                }
              >
                <Volume2 className="h-4 w-4"/>
              </Button>

            )}



            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                feedback==="up" &&
                "text-primary"
              )}
              onClick={() =>
                setFeedback(
                  feedback==="up"
                  ? null
                  : "up"
                )
              }
            >
              <ThumbsUp className="h-4 w-4"/>
            </Button>



            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full",
                feedback==="down" &&
                "text-destructive"
              )}
              onClick={() =>
                setFeedback(
                  feedback==="down"
                  ? null
                  : "down"
                )
              }
            >
              <ThumbsDown className="h-4 w-4"/>
            </Button>


          </div>

        )}

      </div>


    </div>







    {/* Quick actions */}

    {isAssistant &&
      isLast &&
      message.content &&
      onQuickAction && (

      <div
        className="
          mt-4
          flex flex-wrap gap-2
          pl-14
        "
      >

        {QUICK_ACTIONS.map((a)=>(

          <button
            key={a.label}
            onClick={() =>
              onQuickAction(a.instruction)
            }
            className="
              rounded-full
              border border-border/70
              bg-card
              px-4 py-2
              text-xs
              shadow-sm
              transition
              hover:bg-accent
              hover:border-primary/40
            "
          >
            {a.label}
          </button>

        ))}

      </div>

    )}

  </div>
);
}
