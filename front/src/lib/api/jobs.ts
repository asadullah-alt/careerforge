import { BACKEND_URL, RESUME_API_URL, apiGet, apiPost } from './client';

/** POST /api/allJobs — fetch all saved jobs for the logged-in user */
export async function getAllJobs(token: string) {
  return apiPost(`${BACKEND_URL}/api/allJobs`, { token });
}

/** GET /api/v1/jobs?job_id=...&token=... — fetch a single job with user context */
export async function getJobById(jobId: string, token: string) {
  const params = new URLSearchParams({ job_id: jobId, token });
  return apiGet(`${RESUME_API_URL}/api/v1/jobs?${params}`);
}

/** GET /api/v1/jobs/openjob?job_id=... — public job page (no auth) */
export async function getOpenJob(jobId: string) {
  return apiGet(
    `${RESUME_API_URL}/api/v1/jobs/openjob?job_id=${encodeURIComponent(jobId)}`,
  );
}

/** GET /matches/enriched — fetch enriched job matches with user context */
export async function getEnrichedMatches(token: string) {
  return apiGet(`${RESUME_API_URL}/matches/enriched`, {
    headers: {
      'X-User-Token': token,
    },
  });
}
