"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { AppLanguage, LANGUAGES, RESPONSE_MODES, ResponseMode, SCHOOL_LEVELS, SchoolLevel } from "@/lib/types";
import { Menu, Settings, User } from "lucide-react";

function TopbarSelect<T extends string>({
  value,
  onChange,
  items
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string }[];
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger className="h-8 w-auto gap-1 rounded-lg border border-border bg-card px-2.5 text-xs font-medium shadow-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Topbar({
  onOpenSidebar,
  onOpenSettings
}: {
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
}) {
  const { preferences, setPreferences } = useAppStore();

  return (
  <header
    className="
      sticky top-0 z-20
      flex items-center justify-between
      border-b border-border/60
      bg-background/80
      px-3 py-3
      backdrop-blur-xl
      sm:px-5
    "
  >

    {/* Left */}
    <div className="flex items-center gap-3">

      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl md:hidden"
        onClick={onOpenSidebar}
      >
        <Menu className="h-5 w-5"/>
      </Button>


      {/* Brand */}
      <div className="hidden items-center gap-2 sm:flex">

        <div
          className="
            flex h-9 w-9
            items-center justify-center
            rounded-xl
            bg-primary/10
          "
        >
          <span className="text-lg">
            🎓
          </span>
        </div>


        <div className="leading-tight">

          <div className="flex items-center gap-2">

            <span className="font-semibold">
              EduIA
            </span>


            <span
              className="
                rounded-full
                bg-primary/10
                px-2 py-0.5
                text-[10px]
                font-medium
                text-primary
              "
            >
              Groq AI
            </span>

          </div>


          <p className="text-[11px] text-muted-foreground">
            Assistant scolaire intelligent
          </p>

        </div>

      </div>



      {/* Selectors */}
      <div
        className="
          hidden
          items-center
          gap-2
          lg:flex
        "
      >

        <TopbarSelect
          value={preferences.level}
          onChange={(v: SchoolLevel) =>
            setPreferences({level:v})
          }
          items={SCHOOL_LEVELS.map((l)=>({
            value:l,
            label:l
          }))}
        />


        <TopbarSelect
          value={preferences.language}
          onChange={(v: AppLanguage)=>
            setPreferences({language:v})
          }
          items={LANGUAGES.map((l)=>({
            value:l.code,
            label:l.label
          }))}
        />


        <TopbarSelect
          value={preferences.responseMode}
          onChange={(v:ResponseMode)=>
            setPreferences({responseMode:v})
          }
          items={RESPONSE_MODES.map((m)=>({
            value:m.value,
            label:m.label
          }))}
        />

      </div>

    </div>




    {/* Settings */}
    <button
      onClick={onOpenSettings}
      className="
        group
        flex items-center gap-2
        rounded-2xl
        border border-border/70
        bg-card
        px-3 py-1.5
        text-xs
        font-medium
        shadow-sm
        transition
        hover:border-primary/40
        hover:bg-accent
      "
    >

      <Avatar className="h-7 w-7">

        <AvatarFallback
          className="
            bg-primary/10
            text-primary
          "
        >
          <User className="h-4 w-4"/>
        </AvatarFallback>

      </Avatar>


      <div className="hidden items-center gap-1.5 sm:flex">

        <Settings
          className="
            h-3.5 w-3.5
            text-muted-foreground
            transition
            group-hover:text-primary
          "
        />

        <span>
          Paramètres
        </span>

      </div>


    </button>


  </header>
);
}
