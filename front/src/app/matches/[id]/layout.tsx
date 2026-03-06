import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Search Details | Bhai Kaam Do',
  description: 'Explore the Job Search Details page on Bhai Kaam Do. Simplifying your job search with AI-driven insights and tools.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
