import { BACKEND_URL, apiPost } from './client';

/** POST /list — list all resumes for the user */
export async function listResumes(token: string) {
  return apiPost(`${BACKEND_URL}/list`, { token });
}

/** POST /api/resume/load — load a single resume by id */
export async function loadResume(id: string, token: string) {
  return apiPost(`${BACKEND_URL}/api/resume/load`, { id, token });
}

/** POST /api/resume/delete — delete a resume by id */
export async function deleteResume(id: string, token: string) {
  return apiPost(`${BACKEND_URL}/api/resume/delete`, { id, token });
}

/** POST /api/resume/rename — rename a resume */
export async function renameResume(
  id: string,
  title: string,
  token: string,
) {
  return apiPost(`${BACKEND_URL}/api/resume/rename`, { id, title, token });
}

/** POST /api/savePersonalData — fire-and-forget sync of personal data */
export async function savePersonalData(
  personalData: unknown,
  resumeId?: string | null,
) {
  return apiPost(`${BACKEND_URL}/api/savePersonalData`, {
    personal_data: personalData,
    resume_id: resumeId || undefined,
  });
}
