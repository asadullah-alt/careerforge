import { BACKEND_URL, apiPost } from './client';

/** POST /login */
export async function login(email: string, password: string) {
  return apiPost(`${BACKEND_URL}/login`, { email, password });
}

/** POST /signup */
export async function signup(
  email: string,
  password: string,
  remember?: boolean,
) {
  return apiPost(`${BACKEND_URL}/signup`, { email, password, remember });
}

/** POST /verify-email */
export async function verifyEmail(email: string, code: string) {
  return apiPost(`${BACKEND_URL}/verify-email`, { email, code });
}

/** POST /resend-verification */
export async function resendVerification(email: string) {
  return apiPost(`${BACKEND_URL}/resend-verification`, { email });
}

/** POST /forgot-password */
export async function forgotPassword(email: string) {
  return apiPost(`${BACKEND_URL}/forgot-password`, { email });
}

/** POST /reset-password */
export async function resetPassword(token: string, newPassword: string) {
  return apiPost(`${BACKEND_URL}/reset-password`, { token, newPassword });
}

/** Returns the full Google OAuth redirect URL. */
export function getGoogleAuthUrl(): string {
  return `${BACKEND_URL}/auth/google`;
}
