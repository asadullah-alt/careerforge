import { BACKEND_URL, apiGet, apiPatch } from './client';

export interface UserPreferences {
    salary_min: number | null;
    salary_max: number | null;
    visa_sponsorship: boolean | null;
    remote_friendly: boolean | null;
    country: string | null;
}

export interface UserPreferencesUpdate extends Partial<UserPreferences> {
    token: string;
}

/** GET /preferences */
export async function getUserPreferences(token: string): Promise<UserPreferences> {
    return apiGet(`${BACKEND_URL}/api/v1/user/preferences?token=${encodeURIComponent(token)}`);
}

/** PATCH /preferences */
export async function updateUserPreferences(payload: UserPreferencesUpdate): Promise<UserPreferences> {
    return apiPatch(`${BACKEND_URL}/api/v1/user/preferences`, payload);
}
