import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verify | Bhai Kaam Do',
  description: 'Explore the Verify page on Bhai Kaam Do. Simplifying your job search with AI-driven insights and tools.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
