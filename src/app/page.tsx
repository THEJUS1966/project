"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LetterForm,
  formSchema,
  type FormValues,
} from "@/components/letter-form";
import { LetterPreview } from "@/components/letter-preview";
import { generateLetterContent } from "@/ai/flows/generate-letter-content";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function Home() {
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTone, setCurrentTone] = useState<FormValues["tone"]>("professional");

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      letterText: "",
      fromName: "",
      toName: "",
      recipientOption: "None",
      recipientName: "",
      tone: "professional",
    },
  });

  const handleGenerateLetter = async (values: FormValues) => {
    setIsLoading(true);
    setGeneratedLetter("");
    setCurrentTone(values.tone);
    try {
      const result = await generateLetterContent({
        letter_text: values.letterText,
        tone: values.tone,
        from_name: values.fromName,
        to_name: values.toName,
        recipient_option: values.recipientOption,
        recipient_name: values.recipientName,
      });
      setGeneratedLetter(result.letter_content);
    } catch (error) {
      console.error("Error generating letter:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate letter. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustTone = async (newTone: FormValues["tone"]) => {
    const currentValues = form.getValues();
    if (!currentValues.letterText) {
      toast({
        variant: "destructive",
        title: "Missing Content",
        description: "Please describe what the letter is about before adjusting the tone.",
      });
      return;
    }
    form.setValue('tone', newTone);
    await handleGenerateLetter({ ...currentValues, tone: newTone });
  };

  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <header className="mb-8 text-center pt-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-full">
                <Mail className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
              Letter Box
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Craft the perfect letter for any occasion. Simply describe your purpose,
            choose a tone, and let our AI assistant handle the rest.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="mb-8 lg:mb-0">
            <LetterForm
              form={form}
              onSubmit={handleGenerateLetter}
              isLoading={isLoading}
            />
          </div>
          <div>
            <LetterPreview
              letterContent={generatedLetter}
              isLoading={isLoading}
              onAdjustTone={handleAdjustTone}
              currentTone={currentTone}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
