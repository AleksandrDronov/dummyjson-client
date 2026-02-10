import { createContext } from "react";
import type { AuthCredentials, AuthState } from "../types/auth";

export interface AuthContextValue extends AuthState {
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
