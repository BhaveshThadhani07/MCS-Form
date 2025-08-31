'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user behavior logs and anomaly scores to identify high-risk test-takers.
 *
 * - analyzeUserBehavior - An async function that analyzes user behavior and returns a risk assessment.
 * - AnalyzeUserBehaviorInput - The input type for the analyzeUserBehavior function.
 * - AnalyzeUserBehaviorOutput - The output type for the analyzeUserBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserBehaviorInputSchema = z.object({
  userBehaviorLogs: z.string().describe('Detailed logs of user behavior during the test, including tab switches, focus changes, and other relevant actions.'),
  anomalyScore: z.number().describe('A numerical score representing the degree of anomalous behavior exhibited by the user.'),
});
export type AnalyzeUserBehaviorInput = z.infer<typeof AnalyzeUserBehaviorInputSchema>;

const AnalyzeUserBehaviorOutputSchema = z.object({
  riskAssessment: z.string().describe('A comprehensive risk assessment based on the user behavior logs and anomaly score, indicating the likelihood of cheating or policy violations.'),
  cheatingPatterns: z.string().describe('Summary of the identified cheating patterns, if any.'),
  recommendations: z.string().describe('Recommendations for further investigation or actions based on the risk assessment.'),
});
export type AnalyzeUserBehaviorOutput = z.infer<typeof AnalyzeUserBehaviorOutputSchema>;

export async function analyzeUserBehavior(input: AnalyzeUserBehaviorInput): Promise<AnalyzeUserBehaviorOutput> {
  return analyzeUserBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserBehaviorPrompt',
  input: {schema: AnalyzeUserBehaviorInputSchema},
  output: {schema: AnalyzeUserBehaviorOutputSchema},
  prompt: `You are an expert in analyzing user behavior logs and anomaly scores to detect potential cheating during online tests.

  Analyze the following user behavior logs and anomaly score to provide a risk assessment, identify any cheating patterns, and provide recommendations for further investigation.

  User Behavior Logs: {{{userBehaviorLogs}}}
  Anomaly Score: {{{anomalyScore}}}

  Based on this information, provide a detailed risk assessment, a summary of identified cheating patterns (if any), and recommendations for further actions.
  Be brief and concise. The riskAssessment field should be a JSON string with a "riskLevel" ("Low", "Medium", "High") and "details" field.
  `,
});

export const analyzeUserBehaviorFlow = ai.defineFlow(
  {
    name: 'analyzeUserBehaviorFlow',
    inputSchema: AnalyzeUserBehaviorInputSchema,
    outputSchema: AnalyzeUserBehaviorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
