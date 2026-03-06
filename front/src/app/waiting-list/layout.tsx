import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Waiting List | Bhai Kaam Do',
  description: 'Explore the Waiting List page on Bhai Kaam Do. Simplifying your job search with AI-driven insights and tools.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
