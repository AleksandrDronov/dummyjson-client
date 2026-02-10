import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthCredentials,
  AuthState,
  AuthUser,
  AuthResponse,
} from "../types/auth";
import { AuthContext, type AuthContextValue } from "./AuthContext";
import { loginRequest, logoutRequest, meRequest } from "../api/auth";


function mapResponseToUser(response: AuthResponse): AuthUser {
  return {
    id: response.id,
    username: response.username,
    firstName: response.firstName,
    lastName: response.lastName,
    email: response.email,
    image: response.image,
  };
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    rememberMe: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function loadCurrentUser() {
      try {
        const response = await meRequest();
        const user = mapResponseToUser(response);
        if (!mounted) return;
        setAuthState((prev) => ({ ...prev, user, isLoading: false }));
      } catch {
        if (!mounted) return;
        setAuthState({ user: null, rememberMe: false, isLoading: false });
      }
    }

    void loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    try {
      const response = await loginRequest(credentials);
      const user = mapResponseToUser(response);

      setAuthState((prev) => ({
        ...prev,
        user,
        rememberMe: credentials.rememberMe,
        isLoading: false,
      }));
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    void logoutRequest().catch(() => {
      // ignore
    });
    setAuthState((prev) => ({ ...prev, user: null, rememberMe: false, isLoading: false }));
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({ ...authState, login, logout }),
    [authState, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
