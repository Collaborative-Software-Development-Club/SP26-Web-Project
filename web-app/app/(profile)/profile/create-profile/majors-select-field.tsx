"use client";

import type { Major } from "@/app/(profile)/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import { useMemo } from "react";
import { MAX_MAJORS } from "./helpers";

function sameId(a: string, b: string) {
  return String(a) === String(b);
}

export function MajorsSelectField({
  selectedMajors,
  catalog,
  disabled,
  toggleMajor,
}: {
  selectedMajors: Major[];
  catalog: Major[];
  disabled?: boolean;
  toggleMajor: (major: Major) => void;
}) {
  const normalizedCatalog = useMemo(
    () =>
      catalog.map((m) => ({
        ...m,
        major_id: String(m.major_id),
      })),
    [catalog],
  );

  const isSelected = (major: Major) =>
    selectedMajors.some((s) => sameId(s.major_id, major.major_id));

  const atLimit = selectedMajors.length >= MAX_MAJORS;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="majors-dropdown" className="text-sm font-medium">
          Majors
        </Label>
      </div>

      {selectedMajors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMajors.map((m) => (
            <span
              key={String(m.major_id)}
              className="inline-flex max-w-full items-center gap-0.5 rounded-full border border-border bg-muted/40 py-0.5 pl-3 pr-0.5 text-sm text-foreground"
            >
              <span className="max-w-[200px] truncate">{m.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="shrink-0 rounded-full text-muted-foreground hover:bg-background/80 hover:text-foreground"
                onClick={() => toggleMajor(m)}
                disabled={disabled}
                aria-label={`Remove ${m.name}`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </Button>
            </span>
          ))}
        </div>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="majors-dropdown"
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-9 w-full justify-between font-normal shadow-xs"
          >
            <span className="truncate text-left text-muted-foreground">
              Browse
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <ul
            role="listbox"
            aria-label="Majors"
            className="max-h-56 overflow-y-auto overscroll-contain py-1 [scrollbar-gutter:stable]"
          >
            {normalizedCatalog.map((major) => {
              const selected = isSelected(major);
              const addBlocked = !selected && atLimit;
              return (
                <li key={major.major_id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    disabled={disabled || addBlocked}
                    title={addBlocked ? `Maximum ${MAX_MAJORS} majors` : undefined}
                    onClick={() => toggleMajor(major)}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2 text-left text-sm outline-none",
                      "hover:bg-accent focus-visible:bg-accent",
                      selected && "bg-accent/60",
                      (disabled || addBlocked) && !selected && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{major.name}</span>
                    {selected && (
                      <Check
                        className="size-4 shrink-0 text-primary"
                        aria-hidden
                        strokeWidth={2.5}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
