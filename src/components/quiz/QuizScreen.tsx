
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, ShieldAlert, Timer } from 'lucide-react';
import type { Question, Answers } from '@/lib/types';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';

interface QuizScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  answers: Answers;
  onAnswer: (questionId: number, answer: string | string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  onReview: () => void;
  questionTimer: number;
  anomalyScore: number;
  canGoBack: boolean;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const getScoreColor = (score: number) => {
    if (score > 50) return 'text-destructive';
    if (score > 30) return 'text-yellow-500';
    return 'text-primary';
}

export const QuizScreen: FC<QuizScreenProps> = ({
  question,
  currentIndex,
  totalQuestions,
  answers,
  onAnswer,
  onNext,
  onPrev,
  onReview,
  questionTimer,
  anomalyScore,
  canGoBack,
}) => {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const currentAnswer = answers[question.id];

  const renderQuestionType = () => {
    switch(question.type) {
      case 'subjective':
        return (
          <div>
            <Textarea
              value={(currentAnswer as string) || ''}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[150px]"
              maxLength={question.wordLimit ? question.wordLimit * 6 : undefined } // Approximate word limit
            />
            {question.wordLimit && <p className="text-sm text-muted-foreground mt-2">Word Limit: {question.wordLimit}</p>}
          </div>
        );
      case 'mcq':
        return (
          <div className="space-y-4">
            {question.options.map((option) => (
              <Label
                key={option}
                className="flex cursor-pointer items-center gap-4 rounded-md border p-4 transition-colors hover:bg-accent/20 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <Checkbox
                  checked={(currentAnswer as string[])?.includes(option)}
                  onCheckedChange={(checked) => {
                    const oldAnswers = (currentAnswer as string[]) || [];
                    const newAnswers = checked ? [...oldAnswers, option] : oldAnswers.filter(a => a !== option);
                    onAnswer(question.id, newAnswers);
                  }}
                  id={option}
                />
                <span className="text-base">{option}</span>
              </Label>
            ))}
          </div>
        )
      default: // single choice mcq
        return (
           <RadioGroup
              value={currentAnswer as string}
              onValueChange={(value) => onAnswer(question.id, value)}
              className="space-y-4"
            >
              {question.options.map((option) => (
                <Label
                  key={option}
                  className="flex cursor-pointer items-center gap-4 rounded-md border p-4 transition-colors hover:bg-accent/20 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem value={option} id={option} />
                  <span className="text-base">{option}</span>
                </Label>
              ))}
            </RadioGroup>
        )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="w-full">
            <Progress value={progress} />
            <p className="mt-2 text-sm text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className='flex gap-2'>
            <div className="flex shrink-0 items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-medium tabular-nums">
                <ShieldAlert className={`h-4 w-4 ${getScoreColor(anomalyScore)}`} />
                <span className={getScoreColor(anomalyScore)}>{anomalyScore}/100</span>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-medium tabular-nums">
                <Timer className="h-4 w-4 text-orange-500" />
                <span className={questionTimer <= 30 ? 'text-red-500 font-bold' : 'text-orange-500'}>
                  {formatTime(questionTimer)}
                </span>
            </div>
          </div>
        </div>

        {questionTimer <= 30 && questionTimer > 0 && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-center">
            <p className="text-sm font-medium text-red-800">
              ⚠️ Less than 30 seconds remaining for this question!
            </p>
          </div>
        )}

        <Card className="animate-fade-in shadow-lg" key={question.id}>
          <CardHeader>
            <CardTitle className="text-2xl leading-relaxed">{question.question}</CardTitle>
            <CardDescription>{question.type === 'mcq' ? 'You can choose more than 1 option.' : (question.type === 'single-choice' ? 'Select the best option below.' : ' ')}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderQuestionType()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onPrev} disabled={!canGoBack}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {currentIndex === totalQuestions - 1 ? (
              <Button onClick={onNext} variant="secondary">
                Submit All Answers
              </Button>
            ) : (
              <Button onClick={onNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
