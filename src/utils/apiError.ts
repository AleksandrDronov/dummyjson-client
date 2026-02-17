import { ApiError } from '../api/httpClient';

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body as { message?: string; error?: string } | undefined;
    return body?.message ?? body?.error ?? 'Не удалось выполнить вход';
  }
  return 'Произошла неизвестная ошибка';
}
