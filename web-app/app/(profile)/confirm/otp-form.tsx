"use client"
import React from 'react';
import {
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { verifyAction } from '../_actions';
import { useState } from 'react';
import { useRef } from 'react';

export const OtpForm = ({ error, message, email }: { error?: string, message?: string, email: string }) => {
  const length = 6;
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const token = values.join("");
    await verifyAction(token, email);
  }

  function handleChange(index:number, value:string){
    const char = value.slice(-1);
    if(!/^\d$/.test(char)) return;
    const newValues = [...values];
    newValues[index] = char;
    setValues(newValues);
    if(index < length - 1 && char) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace") {
      // if current box has a value, clear it
      if (values[index]) {
        const newValues = [...values];
        newValues[index] = "";
        setValues(newValues);
        return;
      }

      // if already empty, move back and clear previous
      if (index > 0) {
        const newValues = [...values];
        newValues[index - 1] = "";
        setValues(newValues);
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\s/g, "")
      .slice(0, length);

    if (!pasted) return;

    const newValues = [...values];

    for (let i = 0; i < length; i++) {
      newValues[i] = pasted[i] ?? "";
    }

    setValues(newValues);

    const nextIndex = Math.min(pasted.length, length) - 1;
    if (nextIndex >= 0) {
      inputRefs.current[nextIndex]?.focus();
    }
  }


  return (
    <>

      <CardContent className="flex flex-col gap-4">
        {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {decodeURIComponent(error)}
            </p>
          )}
          {message && (
            <p className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
              {decodeURIComponent(message)}
            </p>
          )}
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
            <Label htmlFor="otp" className="text-sm font-semibold text-foreground">Enter Verification Code</Label>
            <div className="flex gap-3 justify-center">
                {values.map((value, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="h-14 w-20 rounded-lg border-2 border-input bg-background text-center text-xl font-semibold transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none hover:border-primary/50"
                  />
                ))}
            </div>
            </div>
            <Button type="submit" className="w-full mt-6 h-11">
            Verify OTP
            </Button>
        </form>
      </CardContent>
    </>
  );
};
