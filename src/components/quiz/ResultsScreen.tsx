
import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User, Mail, Book, ShieldAlert, BarChart, FileText } from 'lucide-react';
import type { Question, Answers, UserDetails, AnomalyLog, RiskAnalysis, AnomalyCounts } from '@/lib/types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ResultsScreenProps {
  questions: Question[];
  answers: Answers;
  onRestart: () => void;
  userDetails: UserDetails | null;
  getRiskAnalysis: (data: {
    anomalyLogs: AnomalyLog[];
    anomalyScore: number;
  }) => Promise<{ success: boolean; data?: RiskAnalysis; error?: string }>;
  anomalyScore: number;
  anomalyLogs: AnomalyLog[];
}

export const ResultsScreen: FC<ResultsScreenProps> = ({ 
    questions, 
    answers, 
    onRestart, 
    userDetails,
    getRiskAnalysis,
    anomalyScore,
    anomalyLogs
}) => {
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      const result = await getRiskAnalysis({ anomalyLogs, anomalyScore });
      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        setError(result.error || "An unknown error occurred.");
      }
      setIsLoading(false);
    };

    performAnalysis();
    
    const timer = setTimeout(() => {
        window.location.href = 'https://techbybhavesh.com/';
    }, 60000);

    return () => clearTimeout(timer);
  }, [getRiskAnalysis, anomalyLogs, anomalyScore]);

  const renderAnswer = (question: Question, answer: string | string[]) => {
    if (!answer || (Array.isArray(answer) && answer.length === 0)) return <span className="font-semibold text-foreground">N/A</span>;
    if (Array.isArray(answer)) return <span className="font-semibold text-foreground">{answer.join(", ")}</span>;
    return <span className="font-semibold text-foreground truncate">{answer}</span>;
  }

  const getScoreColor = (score: number) => {
    if (score > 50) return 'bg-destructive/80 border-destructive';
    if (score > 30) return 'bg-yellow-500/80 border-yellow-600';
    return 'bg-green-500/80 border-green-600';
  }

  const anomalyCounts = anomalyLogs.reduce((acc, log) => {
    acc[log.type] = (acc[log.type] || 0) + 1;
    return acc;
  }, {} as AnomalyCounts);

  let riskAssessmentData: { riskLevel?: 'Low' | 'Medium' | 'High', details?: string } = {};
  if (analysis?.riskAssessment) {
    try {
      riskAssessmentData = JSON.parse(analysis.riskAssessment);
    } catch (e) {
      // It's a plain string, not a JSON object.
    }
  }


  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">

        <Card className="overflow-hidden shadow-2xl">
          <CardHeader className="bg-card p-6 text-center">
            <CardTitle className="text-4xl font-bold">Quiz Submitted</CardTitle>
            <CardDescription className="text-xl text-muted-foreground">Your submission has been recorded.</CardDescription>
          </CardHeader>
        </Card>
        
        {userDetails && <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'><User />Student Details</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className='flex items-center gap-2'><Mail className='text-muted-foreground' /> <p><strong>Email:</strong> {userDetails.email}</p></div>
            <div className='flex items-center gap-2'><User className='text-muted-foreground' /> <p><strong>Name:</strong> {userDetails.fullName}</p></div>
            <div className='flex items-center gap-2'><Book className='text-muted-foreground' /> <p><strong>Class:</strong> {userDetails.class}th Grade</p></div>
          </CardContent>
        </Card>}

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert />Behavioral Analysis</CardTitle>
                <CardDescription>An overview of the monitoring while filling the form.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <p>Analyzing behavior...</p> : error ? <Alert variant="destructive"><AlertTitle>Analysis Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert> : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center gap-4 text-center">
                            <div>
                                <p className="text-muted-foreground">Anomaly Score</p>
                                <p className={`text-5xl font-bold p-4 rounded-full ${getScoreColor(anomalyScore)}`}>{anomalyScore}</p>
                            </div>
                        </div>

                        {analysis?.cheatingPatterns && (
                            <Alert>
                                <BarChart className="h-4 w-4" />
                                <AlertTitle>AI Identified Patterns</AlertTitle>
                                <AlertDescription>{analysis.cheatingPatterns}</AlertDescription>
                            </Alert>
                        )}
                        
                        {Object.keys(anomalyCounts).length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Anomaly Breakdown:</h4>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(anomalyCounts).map(([type, count]) => (
                                    <Badge key={type} variant="secondary">{type}: {count}</Badge>
                                ))}
                            </div>
                          </div>
                        )}

                        {analysis?.recommendations && (
                            <Alert variant="destructive">
                                <FileText className="h-4 w-4" />
                                <AlertTitle>AI Recommendations</AlertTitle>
                                <AlertDescription>{analysis.recommendations}</AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Answer Summary</CardTitle>
                <CardDescription>A review of your answers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {questions.map(q => (
                    <div key={q.id} className="text-sm">
                        <p className="font-medium">{q.id}. {q.question}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-muted-foreground">
                                Your answer: {renderAnswer(q, answers[q.id])}
                            </p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
};