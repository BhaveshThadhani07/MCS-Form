'use server';

/**
 * @fileOverview A Genkit flow to validate if a user's provided name is a real name.
 *
 * - validateName - An async function that validates a name and returns whether it's valid and a reason if not.
 * - ValidateNameInput - The input type for the validateName function.
 * - ValidateNameOutput - The output type for the validateName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateNameInputSchema = z.object({
  name: z.string().describe('The name provided by the user.'),
});
export type ValidateNameInput = z.infer<typeof ValidateNameInputSchema>;

const ValidateNameOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the provided name is considered a real, valid name.'),
  reason: z.string().describe('A brief explanation if the name is deemed invalid (e.g., "It appears to be random characters.").'),
});
export type ValidateNameOutput = z.infer<typeof ValidateNameOutputSchema>;

export async function validateName(input: ValidateNameInput): Promise<ValidateNameOutput> {
  return validateNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateNamePrompt',
  input: {schema: ValidateNameInputSchema},
  output: {schema: ValidateNameOutputSchema},
  prompt: `You are an expert at validating user inputs. Analyze the provided name to determine if it is a real, plausible human name.

  The name is: {{{name}}}

  Consider the following a non-exhaustive list of invalid names:
  - Random characters (e.g., "aaa", "asdfghjkl", "riy98h3")
  - Keyboard mashing (e.g., "qwert", "zxcvb")
  - Placeholder text (e.g., "Test User", "John Doe", "User")
  - Offensive or inappropriate words
  - Single characters (unless it's a common initial)
  - Names with random numbers mixed in (e.g., "John123", "abc456")
  - Names that are clearly fake or made up

  If the name is invalid, provide a concise reason. If it seems valid, just confirm it.
  `,
});

export const validateNameFlow = ai.defineFlow(
  {
    name: 'validateNameFlow',
    inputSchema: ValidateNameInputSchema,
    outputSchema: ValidateNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
