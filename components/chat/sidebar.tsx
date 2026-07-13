"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { groupConversationsByDate } from "@/lib/date-groups";
import {
  BookOpen,
  GraduationCap,
  Mic,
  MoreHorizontal,
  PenSquare,
  Pencil,
  Search,
  Settings,
  Trash2,
  X
} from "lucide-react";

export function Sidebar({
  open,
  onClose,
  onOpenSettings,
  onOpenRevision,
  onOpenVoiceMode
}: {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenRevision: () => void;
  onOpenVoiceMode: () => void;
}) {
  const {
    conversations,
    activeConversationId,
    newConversation,
    setActiveConversation,
    deleteConversation,
    renameConversation
  } = useAppStore();

  const [query, setQuery] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const filtered = useMemo(
    () => conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [conversations, query]
  );
  const groups = useMemo(() => groupConversationsByDate(filtered), [filtered]);

  const commitRename = (id: string) => {
    if (draftTitle.trim()) renameConversation(id, draftTitle.trim());
    setRenamingId(null);
  };

  return (
  <>
    {open && (
      <div
        className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />
    )}


    <aside
      className={cn(
        `
        fixed z-40 flex h-full w-80 flex-col
        border-r border-border/60
        bg-sidebar
        text-sidebar-foreground
        transition-transform
        md:relative
        md:translate-x-0
        `,
        open
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      )}
    >


      {/* Header */}

      <div className="
        flex items-center justify-between
        px-5 py-5
      ">

        <div className="flex items-center gap-3">

          <div className="
            flex h-10 w-10
            items-center justify-center
            rounded-2xl
            bg-primary
            text-primary-foreground
            shadow-sm
          ">
            <GraduationCap className="h-5 w-5"/>
          </div>


          <div>
            <h1 className="text-lg font-bold">
              Edu<span className="text-primary">IA</span>
            </h1>

            <p className="text-[11px] text-muted-foreground">
              Assistant scolaire IA
            </p>
          </div>


        </div>


        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl md:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4"/>
        </Button>


      </div>




      {/* Actions */}

      <div className="space-y-3 px-4">


        <Button
          className="
            h-11
            w-full
            justify-start
            gap-3
            rounded-2xl
            shadow-sm
          "
          onClick={() => newConversation()}
        >

          <PenSquare className="h-4 w-4"/>

          Nouveau chat

        </Button>



        <Button
          variant="secondary"
          className="
            h-11
            w-full
            justify-start
            gap-3
            rounded-2xl
          "
          onClick={onOpenRevision}
        >

          <BookOpen className="h-4 w-4"/>

          Révision

        </Button>




        <div className="relative">

          <Search
            className="
              absolute left-3 top-1/2
              h-4 w-4
              -translate-y-1/2
              text-muted-foreground
            "
          />


          <Input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="
              h-11
              rounded-2xl
              border-border/60
              bg-card
              pl-10
            "
          />

        </div>


      </div>





      {/* History */}

      <ScrollArea className="mt-5 flex-1 px-3">


        {groups.length === 0 && (

          <p className="
            mt-10
            text-center
            text-xs
            text-muted-foreground
          ">
            Aucune conversation
          </p>

        )}



        <div className="space-y-6 pb-5">


        {groups.map((group)=>(

          <div key={group.label}>


            <p className="
              mb-2
              px-2
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-muted-foreground
            ">
              {group.label}
            </p>



            <div className="space-y-1">


            {group.items.map((c)=>(

              <div
                key={c.id}
                onClick={() =>
                  setActiveConversation(c.id)
                }
                className={cn(
                  `
                  group flex items-center
                  gap-2
                  rounded-xl
                  px-3 py-2.5
                  text-sm
                  cursor-pointer
                  transition-all
                  `,
                  activeConversationId === c.id
                    ?
                    `
                    bg-primary/10
                    text-primary
                    shadow-sm
                    `
                    :
                    `
                    hover:bg-accent
                    `
                )}
              >


                {
                  renamingId === c.id
                  ?
                  (
                    <Input
                      autoFocus
                      value={draftTitle}
                      onChange={(e)=>setDraftTitle(e.target.value)}
                      onClick={(e)=>e.stopPropagation()}
                      onBlur={()=>commitRename(c.id)}
                      onKeyDown={(e)=>
                        e.key==="Enter" &&
                        commitRename(c.id)
                      }
                      className="h-7"
                    />
                  )
                  :
                  (
                    <span className="
                      flex-1 truncate
                    ">
                      {c.title}
                    </span>
                  )
                }



                <DropdownMenu>

                  <DropdownMenuTrigger asChild>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="
                        h-7 w-7
                        opacity-0
                        group-hover:opacity-100
                      "
                      onClick={(e)=>
                        e.stopPropagation()
                      }
                    >
                      <MoreHorizontal className="h-4 w-4"/>
                    </Button>

                  </DropdownMenuTrigger>



                  <DropdownMenuContent align="end">

                    <DropdownMenuItem
                      onClick={()=>{
                        setRenamingId(c.id);
                        setDraftTitle(c.title);
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4"/>
                      Renommer
                    </DropdownMenuItem>


                    <DropdownMenuItem
                      destructive
                      onClick={()=>
                        deleteConversation(c.id)
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4"/>
                      Supprimer
                    </DropdownMenuItem>


                  </DropdownMenuContent>

                </DropdownMenu>


              </div>

            ))}

            </div>


          </div>

        ))}


        </div>


      </ScrollArea>





      {/* Footer */}

      <div className="
        border-t border-border/60
        p-4
      ">


        <button
          onClick={onOpenVoiceMode}
          className="
            mb-3
            flex w-full
            items-center gap-3
            rounded-2xl
            border
            border-primary/30
            bg-primary/10
            p-3
            transition
            hover:bg-primary/20
          "
        >

          <div className="
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-primary
            text-primary-foreground
          ">
            <Mic className="h-5 w-5"/>
          </div>


          <div className="text-left">

            <p className="text-sm font-medium">
              Mode vocal
            </p>

            <p className="text-xs text-muted-foreground">
              Parler avec EduIA
            </p>

          </div>


        </button>



        <Button
          variant="ghost"
          className="
            w-full
            justify-start
            gap-3
            rounded-xl
          "
          onClick={onOpenSettings}
        >

          <Settings className="h-4 w-4"/>

          Paramètres

        </Button>


      </div>


    </aside>
  </>
);
}
