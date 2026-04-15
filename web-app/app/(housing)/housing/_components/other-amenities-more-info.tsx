"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function hrefIfWholeStringIsUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  let candidate = t;
  if (/^www\./i.test(candidate)) candidate = `https://${candidate}`;
  try {
    const u = new URL(candidate);
    if (u.protocol === "http:" || u.protocol === "https:") return u.href;
  } catch {
    return null;
  }
  return null;
}

function firstHttpUrlInText(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s<>)\]]+/i);
  return m ? m[0] : null;
}

export function OtherAmenitiesMoreInfo({ value }: { value: string }) {
  const trimmed = value.trim();
  const wholeUrl = hrefIfWholeStringIsUrl(trimmed);
  const linkHref = wholeUrl ?? firstHttpUrlInText(trimmed);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full" type="button">
          More Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>More Info</DialogTitle>
          <DialogDescription className="sr-only">
            Additional details supplied for this listing.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm break-words whitespace-pre-wrap text-foreground">
          {wholeUrl ? (
            <p className="break-all text-muted-foreground">{trimmed}</p>
          ) : (
            trimmed
          )}
        </div>
        {linkHref && (
          <DialogFooter>
            <Button className="w-full sm:w-auto" asChild>
              <a href={linkHref} target="_blank" rel="noopener noreferrer">
                Open link
              </a>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
