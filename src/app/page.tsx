
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Question, AnomalyLog, QuizState, Answers, UserDetails, AnomalyCounts, AnomalyType } from "@/lib/types";
import { getRiskAnalysis, validateName, validateEmail } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { StartScreen } from "@/components/quiz/StartScreen";
import { QuizScreen } from "@/components/quiz/QuizScreen";
import { ReviewScreen } from "@/components/quiz/ReviewScreen";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";

const QUIZ_DURATION = 3000; // 50 minutes

export default function Home() {
  const [quizState, setQuizState] = useState<QuizState>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(QUIZ_DURATION);
  const [anomalyLogs, setAnomalyLogs] = useState<AnomalyLog[]>([]);
  const [anomalyScore, setAnomalyScore] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  

  const { toast } = useToast();
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const logAnomaly = useCallback((type: AnomalyType, details?: string, score = 10) => {
    // Only log anomalies if the quiz is active
    if (quizState !== 'active') return;

    const newLog = { timestamp: new Date().toISOString(), type, details };
    setAnomalyLogs(prev => [...prev, newLog]);

    // Use a function for the new total score to get the latest state
    setAnomalyScore(currentScore => {
      const newTotalScore = Math.min(currentScore + score, 100);
      let warning = '';
      if (newTotalScore > 50) {
        warning = 'Danger Zone! Further violations may lead to disqualification.';
      } else if (newTotalScore > 30) {
        warning = 'Warning Zone! Please adhere to the rules.';
      }
  
      toast({
        variant: "destructive",
        title: "Anomalous Behavior Detected",
        description: `Action: ${type}. This has been logged. ${warning}`,
      });

      return newTotalScore;
    });

  }, [toast, quizState]);
  
  useEffect(() => {
    // This function will be called by the SecurityManager
    const handleAnomalyEvent = (e: CustomEvent) => {
      const { type, details, score } = e.detail;
      logAnomaly(type, details, score);
    };

    document.addEventListener('anomaly', handleAnomalyEvent as EventListener);

    return () => {
      document.removeEventListener('anomaly', handleAnomalyEvent as EventListener);
    };
  }, [logAnomaly]);

  const requestFullscreen = useCallback(() => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => {
        toast({
          variant: 'destructive',
          title: "Fullscreen Required",
          description: `Failed to enter fullscreen mode: ${err.message}. Please enable it to continue.`
        });
      });
    }
  }, [toast]);
  
  const handleFullscreenChange = useCallback(() => {
    const isCurrentlyFullScreen = document.fullscreenElement != null;
    setIsFullScreen(isCurrentlyFullScreen);
    if (quizState === 'active' && !isCurrentlyFullScreen) {
      logAnomaly('Fullscreen Exit', 'User exited fullscreen mode.', 10);
      // Attempt to re-enter fullscreen
      setTimeout(requestFullscreen, 1000);
    }
  }, [quizState, logAnomaly, requestFullscreen]);

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden' && quizState === 'active') {
      logAnomaly('Visibility Hidden', 'User switched to another tab or window.', 10);
    }
  }, [quizState, logAnomaly]);

  const handleBlur = useCallback(() => {
    // This is often triggered with visibility change, so we can consider removing it to avoid double logging
    // For now, we reduce its score.
    if (quizState === 'active') {
        logAnomaly('Window Blur', 'The form window lost focus.', 7);
    }
  }, [quizState, logAnomaly]);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleFullscreenChange, handleVisibilityChange, handleBlur]);

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimer(QUIZ_DURATION);
    timerIntervalRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setQuizState('review');
          toast({ title: "Time's Up!", description: "Please review and submit your answers." });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [toast]);
  
  const handleStart = (details: UserDetails) => {
    setUserDetails(details);
    setQuizStartTime(new Date());
    requestFullscreen();
    setQuizState("active");
    startTimer();
  };
  
  const handleAnswer = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizState('review');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReview = () => {
    setQuizState('review');
  };
  
  const handleEdit = (questionIndex: number) => {
    setCurrentIndex(questionIndex);
    setQuizState('active');
  };

  const submitToGoogleSheets = useCallback(async (userDetails: UserDetails, answers: Answers, questions: Question[], anomalyScore: number, anomalyLogs: AnomalyLog[], quizStartTime: Date | null) => {
    try {
      // Prepare the data for Google Sheets
      const formData = new FormData();
      
      // Calculate submission duration
      const submissionTime = new Date();
      const submissionDuration = quizStartTime 
        ? Math.round((submissionTime.getTime() - quizStartTime.getTime()) / 1000 / 60) // Duration in minutes
        : 0;
      
      // Add user details and metadata (matching your Google Sheet columns)
      formData.append('fullName', userDetails.fullName);
      formData.append('email', userDetails.email);
      formData.append('class', userDetails.class);
      formData.append('anomalyScore', anomalyScore.toString());
      formData.append('submissionTime', submissionTime.toISOString());
      formData.append('submissionDuration', submissionDuration.toString()); // Duration in minutes
      formData.append('anomalyLogs', JSON.stringify(anomalyLogs));
      
      // Add all 19 questions and answers as separate fields
      questions.forEach((question) => {
        const answer = answers[question.id];
        let answerText = 'No answer provided';
        
        if (answer) {
          if (Array.isArray(answer)) {
            answerText = answer.join(', ');
          } else {
            answerText = answer;
          }
        }
        
        // Create field names that match your Google Sheet columns
        formData.append(`q${question.id}`, answerText);
      });
      
      // Submit to Google Sheets
      const scriptURL = 'https://script.google.com/macros/s/AKfycbx2ly7xcLlloR9fW9KfERYBzAokrv3GgzAMw5aUGEFUKBYcH62OvsTGs4hhNtjsMbCJ/exec';
      
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        console.log('Success! Data submitted to Google Sheets');
        toast({
          title: "Submission Successful",
          description: "Your answers have been submitted successfully.",
        });
      } else {
        throw new Error('Failed to submit to Google Sheets');
      }
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to submit your answers. Please try again.",
      });
    }
  }, [toast]);

  const handleSubmit = useCallback(async () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
    // Submit data to Google Sheets
    if (userDetails) {
      await submitToGoogleSheets(userDetails, answers, questions, anomalyScore, anomalyLogs, quizStartTime);
    }
    
    setQuizState('submitted');
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [userDetails, answers, questions, anomalyScore, anomalyLogs, quizStartTime, submitToGoogleSheets]);

  const handleRestart = () => {
    setQuizState('idle');
    setAnswers({});
    setCurrentIndex(0);
    setTimer(QUIZ_DURATION);
    setAnomalyLogs([]);
    setAnomalyScore(0);
    setUserDetails(null);
    setQuizStartTime(null);
  }
  
  const handleValidateName = useCallback(async (name: string) => {
    const result = await validateName({ name });
    if (result.success && result.data && !result.data.isValid) {
        return result.data.reason || "The provided name appears to be invalid.";
    }
    if (!result.success) {
      return "AI validation failed. Please try again."
    }
    return true;
  }, []);

  const handleValidateEmail = useCallback(async (email: string) => {
    const result = await validateEmail({ email });
    if (result.success && result.data && !result.data.isValid) {
        return result.data.reason || "The provided email appears to be invalid.";
    }
    if (!result.success) {
      return "AI validation failed. Please try again."
    }
    return true;
  }, []);
  
  const handleGetRiskAnalysis = useCallback(async (data: { anomalyLogs: AnomalyLog[], anomalyScore: number }) => {
    const result = await getRiskAnalysis(data);
    return result;
  }, []);


  const renderContent = () => {
    if (questions.length === 0) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }
    
    switch (quizState) {
      case "idle":
        return <StartScreen onStart={handleStart} onValidateName={handleValidateName} onValidateEmail={handleValidateEmail} />;
      case "active":
        return (
          <QuizScreen
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            onReview={handleReview}
            timer={timer}
            anomalyScore={anomalyScore}
          />
        );
      case "review":
        return <ReviewScreen questions={questions} answers={answers} onEdit={handleEdit} onSubmit={handleSubmit} />;
      case "submitted":
        return (
          <ResultsScreen 
            questions={questions}
            answers={answers}
            onRestart={handleRestart}
            userDetails={userDetails}
            getRiskAnalysis={handleGetRiskAnalysis}
            anomalyScore={anomalyScore}
            anomalyLogs={anomalyLogs}
          />
        );
      default:
        return null;
    }
  };

  return <div className="font-body">{renderContent()}</div>;
}
