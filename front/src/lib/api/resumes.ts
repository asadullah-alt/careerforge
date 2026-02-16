import { RESUME_API_URL, apiGet, apiPost, apiPostFormData } from './client';

/** POST /api/v1/resumes/upload — multipart file upload */
export async function uploadResume(
  file: File,
  name: string,
  token: string,
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  formData.append('token', token);
  return apiPostFormData(`${RESUME_API_URL}/api/v1/resumes/upload`, formData);
}

/** GET /api/v1/resumes/getAllUserResumes */
export async function getAllUserResumes(token: string) {
  return apiGet(
    `${RESUME_API_URL}/api/v1/resumes/getAllUserResumes?token=${encodeURIComponent(token)}`,
  );
}

/** POST /api/v1/resumes/setDefaultResume */
export async function setDefaultResume(resumeId: string, token: string) {
  return apiPost(`${RESUME_API_URL}/api/v1/resumes/setDefaultResume`, {
    resume_id: resumeId,
    token,
  });
}

/** POST /api/v1/resumes/improve */
export async function improveResume(
  jobId: string,
  resumeId: string,
  token: string,
  analysisAgain?: boolean,
) {
  return apiPost(`${RESUME_API_URL}/api/v1/resumes/improve`, {
    job_id: jobId,
    resume_id: resumeId,
    token,
    analysis_again: analysisAgain ?? false,
  });
}

/** GET /api/v1/resumes/getImprovements */
export async function getImprovements(
  resumeId: string,
  jobId: string,
  token: string,
) {
  const params = new URLSearchParams({ resume_id: resumeId, job_id: jobId, token });
  return apiGet(`${RESUME_API_URL}/api/v1/resumes/getImprovements?${params}`);
}

/** Returns the full upload endpoint URL (used by use-file-upload hook). */
export function getResumeUploadUrl(): string {
  return `${RESUME_API_URL}/api/v1/resumes/upload`;
}
