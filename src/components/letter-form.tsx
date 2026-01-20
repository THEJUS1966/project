"use client";

import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const formSchema = z
  .object({
    letterText: z
      .string()
      .min(10, "Please describe the purpose of the letter in at least 10 characters."),
    fromName: z.string().optional(),
    toName: z.string().optional(),
    recipientOption: z.enum(["Sir", "Madam", "Name", "None"]),
    recipientName: z.string().optional(),
    tone: z.enum(["friendly", "professional", "formal", "polite", "casual"]),
  })
  .refine(
    (data) => {
      if (data.recipientOption === "Name") {
        return !!data.recipientName && data.recipientName.length > 0;
      }
      return true;
    },
    {
      message: "Recipient name is required.",
      path: ["recipientName"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;

interface LetterFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

const tones: FormValues['tone'][] = ["professional", "friendly", "formal", "polite", "casual"];
const recipientOptions: FormValues['recipientOption'][] = ["None", "Sir", "Madam", "Name"];

export function LetterForm({ form, onSubmit, isLoading }: LetterFormProps) {
  const recipientOption = form.watch("recipientOption");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Compose Your Letter</CardTitle>
        <CardDescription>Fill in the details below to generate your letter.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="letterText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What should the letter be about?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A thank you note for a recent interview..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="toName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Recipient's Name/Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="recipientOption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Greeting</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a greeting" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {recipientOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option === 'Name' ? '[Specific Name]' : option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {recipientOption === "Name" && (
                  <FormField
                    control={form.control}
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
            </div>
            
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tones.map(tone => (
                        <SelectItem key={tone} value={tone}>
                          <span className="capitalize">{tone}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Letter
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
