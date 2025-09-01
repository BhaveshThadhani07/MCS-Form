import { useState, useEffect, useRef, useCallback } from 'react';

interface UseQuestionTimerProps {
  duration: number; // in seconds
  onTimeout: () => void;
  isActive: boolean;
}

interface UseQuestionTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
}

export const useQuestionTimer = ({ 
  duration, 
  onTimeout, 
  isActive 
}: UseQuestionTimerProps): UseQuestionTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const startTimer = useCallback(() => {
    if (!isActive) return;
    
    setIsRunning(true);
    setTimeLeft(duration);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [duration, onTimeout, isActive]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start timer when question becomes active
  useEffect(() => {
    if (isActive && !isRunning) {
      startTimer();
    } else if (!isActive) {
      stopTimer();
    }
  }, [isActive, isRunning, startTimer, stopTimer]);

  // Reset timer when duration changes (for different question types)
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
    }
  }, [duration, isActive]);

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    formatTime
  };
};
