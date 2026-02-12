const AUTH_PATHS = ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/auth/me'];

function needsAuthToken(path: string): boolean {
  return !AUTH_PATHS.some((p) => path.startsWith(p) || path.includes(p));
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  constructor(status: number, body: unknown) {
    super('API request failed');
    this.status = status;
    this.body = body;
  }
}

interface HttpOptions extends RequestInit {
  _skipRetry?: boolean;
}

export function httpGet<T>(path: string, options?: HttpOptions): Promise<T> {
  return httpRequest<T>(path, { ...options, method: 'GET' });
}

export function httpPost<TRequest, TResponse>(
  path: string,
  body: TRequest,
  options?: HttpOptions,
): Promise<TResponse> {
  const requestInit: HttpOptions = {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  };
  return httpRequest<TResponse>(path, requestInit);
}

async function httpRequest<T>(path: string, options: HttpOptions): Promise<T> {
  const { _skipRetry, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Content-Type') && rest.method !== 'GET') {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...rest,
    headers: requestHeaders,
  });

  const data = await response.json().catch(() => undefined);

  if (response.status === 401 && !_skipRetry && needsAuthToken(path)) {
    const { tryRefreshTokens } = await import('./auth');
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      return httpRequest<T>(path, { ...options, _skipRetry: true });
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}
