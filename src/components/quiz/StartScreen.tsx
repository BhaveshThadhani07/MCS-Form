"use client";

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, EyeOff, Keyboard, AlertTriangle, ArrowRight, Timer } from 'lucide-react';
import type { UserDetails } from '@/lib/types';

interface StartScreenProps {
  onStart: (details: UserDetails) => void;
  onValidateName: (name: string) => Promise<true | string>;
  onValidateEmail: (email: string) => Promise<true | string>;
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  class: z.string({ required_error: "Please select your class." }),
});

const InstructionItem: FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <li className="flex items-center gap-4">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <span className="text-muted-foreground">{text}</span>
  </li>
);

export const StartScreen: FC<StartScreenProps> = ({ onStart, onValidateName, onValidateEmail }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Validate name
    const nameValidationResult = await onValidateName(values.fullName);
    if (typeof nameValidationResult === 'string') {
        form.setError('fullName', { type: 'manual', message: nameValidationResult });
        return;
    }
    
    // Validate email
    const emailValidationResult = await onValidateEmail(values.email);
    if (typeof emailValidationResult === 'string') {
        form.setError('email', { type: 'manual', message: emailValidationResult });
        return;
    }
    
    onStart(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl animate-fade-in shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold">Macro Cyber Squad <span className='text-2xl font-normal'>Selection Form</span></CardTitle>
          <CardDescription className="text-lg">Welcome to the form submission portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="7">7th Grade</SelectItem>
                        <SelectItem value="8">8th Grade</SelectItem>
                        <SelectItem value="9">9th Grade</SelectItem>
                        <SelectItem value="10">10th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border bg-card/50 p-6 mt-6">
                <h3 className="mb-4 text-lg font-semibold">Form Filling Rules & Security Measures</h3>
                <ul className="space-y-4">
                  <InstructionItem icon={<ShieldCheck size={20} />} text="The form must be filled in fullscreen mode." />
                  <InstructionItem icon={<EyeOff size={20} />} text="Switching tabs or minimizing the window is prohibited and will be logged." />
                  <InstructionItem icon={<Keyboard size={20} />} text="Right-click and keyboard shortcuts (like Ctrl, Alt) are disabled." />
                  <InstructionItem icon={<AlertTriangle size={20} />} text="All suspicious activities are monitored and will affect your score." />
                  <InstructionItem icon={<Timer size={20} />} text="You have 2 minutes for text questions, 1 minute for multiple choice. Time will auto-advance when expired." />
                  <InstructionItem icon={<AlertTriangle size={20} />} text="You cannot go back to previous questions once you move forward." />
                </ul>
              </div>

              <Button type="submit" className="w-full text-lg" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Validating...' : 'Start Filling the Form'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
