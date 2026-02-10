export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  image?: string;
}

export interface AuthState {
  user: AuthUser | null;
  rememberMe: boolean;
  isLoading: boolean;
}

export interface AuthCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}
/** Ответ логина: только данные пользователя, токены — в HttpOnly cookies */
export interface AuthResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  image?: string;
}

