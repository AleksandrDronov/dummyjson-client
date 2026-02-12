import { httpGet, httpPost } from './httpClient';
import type { AuthCredentials, AuthResponse } from '../types/auth';

/** Access token: 15–30 мин. expiresInMins: 15 */
const ACCESS_TOKEN_EXPIRES_MINS = 30;

export function loginRequest(credentials: AuthCredentials): Promise<AuthResponse> {
  return httpPost<Record<string, unknown>, AuthResponse>(
    '/api/auth/login',
    {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: ACCESS_TOKEN_EXPIRES_MINS,
    },
    {
      credentials: credentials.rememberMe ? 'include' : 'omit',
    },
  );
}

export function meRequest(): Promise<AuthResponse> {
  return httpGet<AuthResponse>('/api/auth/me', {
    credentials: 'include',
  });
}

export function refreshTokenRequest(): Promise<Record<string, never>> {
  return httpPost<{ expiresInMins?: number }, Record<string, never>>(
    '/api/auth/refresh',
    {
      expiresInMins: ACCESS_TOKEN_EXPIRES_MINS,
    },
    {
      credentials: 'include',
    },
  );
}

export async function tryRefreshTokens(): Promise<boolean> {
  try {
    await refreshTokenRequest();
    return true;
  } catch {
    return false;
  }
}

export function logoutRequest(): Promise<Record<string, never>> {
  return httpPost<Record<string, never>, Record<string, never>>('/api/auth/logout', {});
}
