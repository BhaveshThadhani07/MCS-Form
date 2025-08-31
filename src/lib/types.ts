
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string | string[];
  type: 'mcq' | 'subjective' | 'single-choice';
  wordLimit?: number;
}

export type AnomalyType = 'Visibility Hidden' | 'Window Blur' | 'Fullscreen Exit' | 'Context Menu' | 'Copy Attempt' | 'Paste Attempt' | 'Prohibited Key';

export interface AnomalyLog {
  timestamp: string;
  type: AnomalyType;
  details?: string;
}

export type QuizState = "idle" | "active" | "review" | "submitted";

export type Answers = Record<number, string | string[]>;

export interface UserDetails {
  fullName: string;
  email: string;
  class: string;
}

export type AnomalyCounts = {
  [key in AnomalyType]?: number;
};

export interface RiskAnalysis {
  riskAssessment: string;
  cheatingPatterns: string;
  recommendations: string;
}
