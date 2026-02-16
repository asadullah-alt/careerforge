import { RESUME_API_URL, apiPost } from './client';

/** POST /api/v1/cover-letters/getCoverletter */
export async function generateCoverLetter(
  jobId: string,
  resumeId: string,
  token: string,
) {
  return apiPost(`${RESUME_API_URL}/api/v1/cover-letters/getCoverletter`, {
    job_id: jobId,
    resume_id: resumeId,
    token,
  });
}
