// Central barrel export — import { authApi, resumesApi, ... } from '@/lib/api'
export * as authApi from './auth';
export * as resumesApi from './resumes';
export * as userApi from './user';
export * as jobsApi from './jobs';
export * as coverLettersApi from './cover-letters';
export * as resumeBuilderApi from './resume-builder';
export { BACKEND_URL, RESUME_API_URL, ApiError, getAuthToken } from './client';
