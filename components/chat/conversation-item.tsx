"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  title: string;
  active: boolean;

  renaming: boolean;
  draftTitle: string;

  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;

  onDraftChange: (value: string) => void;
  onCommitRename: () => void;
}

export function ConversationItem({
  title,
  active,
  renaming,
  draftTitle,

  onClick,
  onRename,
  onDelete,

  onDraftChange,
  onCommitRename,
}: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200",
        active
          ? "border-blue-500/40 bg-blue-500/10"
          : "border-transparent hover:border-border hover:bg-accent/60"
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          active
            ? "bg-blue-600 text-white"
            : "bg-secondary text-muted-foreground"
        )}
      >
        <MessageSquare className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        {renaming ? (
          <Input
            autoFocus
            value={draftTitle}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onDraftChange(e.target.value)}
            onBlur={onCommitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onCommitRename();
              }
            }}
            className="h-8 rounded-lg"
          />
        ) : (
          <p className="truncate text-sm font-medium">
            {title}
          </p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => e.stopPropagation()}
            className="h-8 w-8 rounded-xl opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onRename}>
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}