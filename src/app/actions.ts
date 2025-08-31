
"use server";

import { analyzeUserBehavior } from "@/ai/flows/analyze-user-behavior";
import { validateName as validateNameFlow } from "@/ai/flows/validate-name";
import { validateEmail as validateEmailFlow } from "@/ai/flows/validate-email";
import type { AnomalyLog, Question } from "@/lib/types";

interface ResultData {
  answers: Record<number, string | string[]>;
  questions: Question[];
  anomalyLogs: AnomalyLog[];
  anomalyScore: number;
}

export async function getRiskAnalysis(data: {
  anomalyLogs: AnomalyLog[];
  anomalyScore: number;
}) {
  try {
    const userBehaviorLogs =
      data.anomalyLogs
        .map(
          (log) => `[${log.timestamp}] ${log.type}: ${log.details || "N/A"}`
        )
        .join("\n") || "No anomalies recorded.";

    const analysis = await analyzeUserBehavior({
      userBehaviorLogs,
      anomalyScore: data.anomalyScore,
    });
    return { success: true, data: analysis };
  } catch (error) {
    console.error("Error analyzing user behavior:", error);
    return {
      success: false,
      error: "An error occurred while analyzing the results.",
    };
  }
}

export async function validateName(input: { name: string }) {
  // Bypass AI validation in production if the Genkit plugin isn't configured for it.
  if (process.env.NODE_ENV === 'production' && !process.env.GOOGLE_AI_API_KEY) {
    return { success: true, data: { isValid: true, reason: '' } };
  }
  
  try {
    const result = await validateNameFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error validating name:", error);
    return { success: false, error: "AI validation failed. Please try again." };
  }
}

export async function validateEmail(input: { email: string }) {
  // Bypass AI validation in production if the Genkit plugin isn't configured for it.
  if (process.env.NODE_ENV === 'production' && !process.env.GOOGLE_AI_API_KEY) {
    return { success: true, data: { isValid: true, reason: '' } };
  }
  
  try {
    const result = await validateEmailFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error validating email:", error);
    return { success: false, error: "AI validation failed. Please try again." };
  }
}
