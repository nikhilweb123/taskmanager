import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Task Manager - Next.js & Supabase',
  description: 'A full-stack CRUD task management application built with Next.js and Supabase',
  openGraph: {
    images: [
      {
        url: 'https://images.pexels.com/photos/3184656/pexels-photo-3184656.jpeg?auto=compress&cs=tinysrgb&w=1200', // example free image
        width: 1200,
        height: 630,
        alt: 'Task Management App Screenshot or Background',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://images.pexels.com/photos/3184656/pexels-photo-3184656.jpeg?auto=compress&cs=tinysrgb&w=1200', // same image
      },
    ],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
