import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SecurityManager } from '@/components/quiz/SecurityManager';

export const metadata: Metadata = {
  title: 'MCS-Form',
  description: 'A secure online examination platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <SecurityManager />
        <main className="flex-grow">{children}</main>
        <Toaster />
        <footer className="text-center font-black p-4 text-muted-foreground">
          Made with 🔥 by Bhavesh Thadhani
        </footer>
      </body>
    </html>
  );
}
