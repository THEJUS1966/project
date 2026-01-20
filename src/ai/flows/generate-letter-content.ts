'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating letter content based on user input.
 *
 * - generateLetterContent - A function that generates letter content based on user input.
 * - GenerateLetterContentInput - The input type for the generateLetterContent function.
 * - GenerateLetterContentOutput - The return type for the generateLetterContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLetterContentInputSchema = z.object({
  letter_text: z.string().describe('The content of the letter.'),
  tone: z.string().describe('The tone of the letter (friendly, professional, formal, polite, casual).'),
  from_name: z.string().optional().describe('The name of the sender (optional).'),
  to_name: z.string().optional().describe('The name of the recipient (optional).'),
  recipient_option: z.string().describe('The recipient option (Sir, Madam, Name, None).'),
  recipient_name: z.string().optional().describe('The name of the recipient (only if option = Name).'),
});
export type GenerateLetterContentInput = z.infer<typeof GenerateLetterContentInputSchema>;

const GenerateLetterContentOutputSchema = z.object({
  letter_content: z.string().describe('The generated letter content.'),
});
export type GenerateLetterContentOutput = z.infer<typeof GenerateLetterContentOutputSchema>;

export async function generateLetterContent(input: GenerateLetterContentInput): Promise<GenerateLetterContentOutput> {
  return generateLetterContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLetterContentPrompt',
  input: {schema: GenerateLetterContentInputSchema},
  output: {schema: GenerateLetterContentOutputSchema},
  prompt: `You are a professional letter-writing assistant.
Generate a clean, simple, and grammatically correct letter based strictly on the user’s input.
General rules:
Follow the selected tone exactly (friendly, professional, formal, polite, casual)
Output only the final letter content
Do not include explanations, skills, relationship details, placeholders, or extra sections
Keep the letter short, clear, and purpose-focused
From / To rules:
{{#if from_name}}From: {{{from_name}}}\n{{/if}}
{{#if to_name}}To: {{{to_name}}}\n{{/if}}
Greeting rules:
{{#if recipient_option}}
  {{#ifEquals recipient_option "Sir"}}Dear Sir,\n{{/ifEquals}}
  {{#ifEquals recipient_option "Madam"}}Dear Madam,\n{{/ifEquals}}
  {{#ifEquals recipient_option "Name"}}Dear {{{recipient_name}}},\n{{/ifEquals}}
{{/if}}

User input:
Letter request: {{{letter_text}}}
Tone: {{{tone}}}`, // Removed Handlebars await and function calls. Fixed handlebars syntax.
  templateHelpers: {
    ifEquals: function (arg1: any, arg2: any, options: any) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

const generateLetterContentFlow = ai.defineFlow(
  {
    name: 'generateLetterContentFlow',
    inputSchema: GenerateLetterContentInputSchema,
    outputSchema: GenerateLetterContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {letter_content: output!.letter_content};
  }
);
