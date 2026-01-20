'use server';

/**
 * @fileOverview This file defines a Genkit flow for adjusting the tone of a generated letter.
 *
 * adjustLetterTone - A function that takes letter content, tone, from name, to name, recipient option, and recipient name as input and returns a letter with the adjusted tone.
 * AdjustLetterToneInput - The input type for the adjustLetterTone function.
 * AdjustLetterToneOutput - The return type for the adjustLetterTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustLetterToneInputSchema = z.object({
  letterText: z.string().describe('The content of the letter.'),
  tone: z.string().describe('The desired tone of the letter (friendly, professional, formal, polite, casual).'),
  fromName: z.string().optional().describe('The name of the sender (optional).'),
  toName: z.string().optional().describe('The name of the recipient (optional).'),
  recipientOption: z.enum(['Sir', 'Madam', 'Name', 'None']).describe('The recipient option (Sir, Madam, Name, or None).'),
  recipientName: z.string().optional().describe('The name of the recipient (only if recipient option is Name).'),
});
export type AdjustLetterToneInput = z.infer<typeof AdjustLetterToneInputSchema>;

const AdjustLetterToneOutputSchema = z.object({
  adjustedLetter: z.string().describe('The letter with the adjusted tone.'),
});
export type AdjustLetterToneOutput = z.infer<typeof AdjustLetterToneOutputSchema>;

export async function adjustLetterTone(input: AdjustLetterToneInput): Promise<AdjustLetterToneOutput> {
  return adjustLetterToneFlow(input);
}

const adjustLetterTonePrompt = ai.definePrompt({
  name: 'adjustLetterTonePrompt',
  input: {schema: AdjustLetterToneInputSchema},
  output: {schema: AdjustLetterToneOutputSchema},
  prompt: `You are a professional letter-writing assistant.
Generate a clean, simple, and grammatically correct letter based strictly on the user’s input.
General rules:
Follow the selected tone exactly ({{{tone}}})
Output only the final letter content
Do not include explanations, skills, relationship details, placeholders, or extra sections
Keep the letter short, clear, and purpose-focused
From / To rules:
{{#if fromName}}
From: {{{fromName}}}
{{/if}}
{{#if toName}}
To: {{{toName}}}
{{/if}}
Greeting rules:
{{#ifEquals recipientOption "Sir"}}
Dear Sir,
{{/ifEquals}}
{{#ifEquals recipientOption "Madam"}}
Dear Madam,
{{/ifEquals}}
{{#ifEquals recipientOption "Name"}}
Dear {{{recipientName}}},
{{/ifEquals}}
{{letterText}}`,
  templateHelpers: {
    ifEquals: function (arg1: any, arg2: any, options: any) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

const adjustLetterToneFlow = ai.defineFlow(
  {
    name: 'adjustLetterToneFlow',
    inputSchema: AdjustLetterToneInputSchema,
    outputSchema: AdjustLetterToneOutputSchema,
  },
  async input => {
    const {output} = await adjustLetterTonePrompt(input);
    return output!;
  }
);
