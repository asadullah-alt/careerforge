import { create } from 'zustand'
import { z } from 'zod'
import { schema } from '@/components/data-table'

// Base type from schema
type BaseJob = z.infer<typeof schema>

// Extended type that relaxes ID field requirements
export type ExtendedJob = Omit<BaseJob, 'job_id' | 'id' | 'jobId'> & {
  id?: string | number;
  jobId?: string | number;
  job_id?: string | number;
  jobUrl?: string;
  job_url?: string;
  src?: string;
}

interface JobStore {
  selectedJob: ExtendedJob | null
  setSelectedJob: (job: ExtendedJob | null) => void
}

export const useJobStore = create<JobStore>((set) => ({
  selectedJob: null,
  setSelectedJob: (job: ExtendedJob | null) => set({ selectedJob: job }),
}))
