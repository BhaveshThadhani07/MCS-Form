
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, Send } from 'lucide-react';
import type { Question, Answers } from '@/lib/types';

interface ReviewScreenProps {
  questions: Question[];
  answers: Answers;
  onEdit: (questionIndex: number) => void;
  onSubmit: () => void;
}

export const ReviewScreen: FC<ReviewScreenProps> = ({ questions, answers, onEdit, onSubmit }) => {
  const answeredCount = Object.values(answers).filter(answer => {
    if (Array.isArray(answer)) return answer.length > 0;
    return !!answer;
  }).length;
  
  const renderAnswer = (answer: string | string[]) => {
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
          return (
            <>
              <X className="mr-2 h-4 w-4 text-destructive" />
              <p className="text-destructive">Not answered</p>
            </>
          )
      }

      const text = Array.isArray(answer) ? answer.join(', ') : answer;
      return (
        <>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <p className="text-muted-foreground">Your answer: <span className="font-semibold text-foreground truncate">{text}</span></p>
        </>
      )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-4xl animate-fade-in shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Review Your Answers</CardTitle>
          <CardDescription>
            You have answered {answeredCount} out of {questions.length} questions. Please review before final submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[50vh] pr-6">
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        answers[q.id] && (!Array.isArray(answers[q.id]) || (answers[q.id] as string[]).length > 0) ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{q.question}</p>
                      <div className="mt-1 flex items-center">
                        {renderAnswer(answers[q.id])}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(index)}>
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardContent className="border-t pt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full text-lg" size="lg">
                <Send className="mr-2 h-5 w-5" />
                Submit Final Answers
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. You will not be able to change your answers after submitting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmit}>Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
