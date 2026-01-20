"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  ClipboardCopy,
  Coffee,
  Handshake,
  Smile,
  Trophy,
  Check,
} from "lucide-react";
import type { FormValues } from "./letter-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LetterPreviewProps {
  letterContent: string;
  isLoading: boolean;
  onAdjustTone: (newTone: FormValues["tone"]) => void;
  currentTone: FormValues["tone"];
}

const toneOptions = [
  { tone: "professional", label: "Professional", icon: Briefcase },
  { tone: "friendly", label: "Friendly", icon: Smile },
  { tone: "formal", label: "Formal", icon: Trophy },
  { tone: "polite", label: "Polite", icon: Handshake },
  { tone: "casual", label: "Casual", icon: Coffee },
] as const;

export function LetterPreview({ letterContent, isLoading, onAdjustTone, currentTone }: LetterPreviewProps) {
  const [hasCopied, setHasCopied] = useState(false);
  
  const handleCopy = () => {
    if(!letterContent) return;
    navigator.clipboard.writeText(letterContent);
    setHasCopied(true);
  };
  
  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  useEffect(() => {
    if (isLoading || letterContent) {
        setHasCopied(false);
    }
  }, [isLoading, letterContent])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Generated Letter</CardTitle>
                <CardDescription>Review, adjust the tone, or copy the letter.</CardDescription>
            </div>
            {letterContent && !isLoading && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy letter text">
                                {hasCopied ? <Check className="h-5 w-5 text-green-500" /> : <ClipboardCopy className="h-5 w-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{hasCopied ? "Copied!" : "Copy to clipboard"}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <div className="flex-grow relative">
          {isLoading ? (
            <div className="space-y-3 h-full p-4 border rounded-md">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : letterContent ? (
            <Textarea
              readOnly
              value={letterContent}
              className="w-full h-full min-h-[300px] bg-background text-base resize-none"
              aria-label="Generated letter content"
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] border-2 border-dashed rounded-lg bg-muted/50">
              <p className="text-muted-foreground">Your generated letter will appear here.</p>
            </div>
          )}
        </div>
        
        {letterContent && !isLoading && (
            <div>
                <p className="text-sm font-medium mb-2 text-foreground">Adjust Tone</p>
                <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                    {toneOptions.map(({ tone, label, icon: Icon }) => (
                        <Tooltip key={tone}>
                            <TooltipTrigger asChild>
                                <Button
                                variant={currentTone === tone ? "default" : "outline"}
                                size="icon"
                                onClick={() => onAdjustTone(tone)}
                                aria-label={`Adjust tone to ${label}`}
                                >
                                <Icon className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                    </TooltipProvider>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
