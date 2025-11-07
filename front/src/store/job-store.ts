import { create } from 'zustand'
import { z } from 'zod'
import { schema } from '@/components/data-table'

type Job = z.infer<typeof schema>

interface JobStore {
  selectedJob: Job | null
  setSelectedJob: (job: Job | null) => void
}
export const useJobStore = create<JobStore>()((set) => ({
  selectedJob: null,
  setSelectedJob: (job) => set({ selectedJob: job }),
}))
