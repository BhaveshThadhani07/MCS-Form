'use server';

/**
 * @fileOverview A Genkit flow to validate if a user's provided email is a real, valid email.
 *
 * - validateEmail - An async function that validates an email and returns whether it's valid and a reason if not.
 * - ValidateEmailInput - The input type for the validateEmail function.
 * - ValidateEmailOutput - The output type for the validateEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateEmailInputSchema = z.object({
  email: z.string().describe('The email provided by the user.'),
});
export type ValidateEmailInput = z.infer<typeof ValidateEmailInputSchema>;

const ValidateEmailOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the provided email is considered a real, valid email.'),
  reason: z.string().describe('A brief explanation if the email is deemed invalid.'),
});
export type ValidateEmailOutput = z.infer<typeof ValidateEmailOutputSchema>;

export async function validateEmail(input: ValidateEmailInput): Promise<ValidateEmailOutput> {
  return validateEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateEmailPrompt',
  input: {schema: ValidateEmailInputSchema},
  output: {schema: ValidateEmailOutputSchema},
  prompt: `You are an expert at validating user email addresses. Analyze the provided email to determine if it is a real, plausible email address.

  The email is: {{{email}}}

  Consider the following a non-exhaustive list of invalid emails:
  - Random characters (e.g., "aaa@test.com", "riy98h3@gmail.com")
  - Keyboard mashing (e.g., "qwert@test.com")
  - Placeholder text (e.g., "test@test.com", "user@example.com")
  - Obviously fake emails (e.g., "fake@fake.com", "dummy@dummy.com")
  - Emails with random numbers and letters (e.g., "abc123@test.com", "xyz789@gmail.com")
  - Emails that don't follow proper email format

  If the email is invalid, provide a concise reason. If it seems valid, just confirm it.
  `,
});

export const validateEmailFlow = ai.defineFlow(
  {
    name: 'validateEmailFlow',
    inputSchema: ValidateEmailInputSchema,
    outputSchema: ValidateEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
); 