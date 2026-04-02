import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "instructor" | "administrator" | "engineer";

export interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, { password: string; role: UserRole }> = {
  instructor: { password: "demo", role: "instructor" },
  admin: { password: "demo", role: "administrator" },
  engineer: { password: "demo", role: "engineer" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const found = MOCK_USERS[username.toLowerCase()];
    if (found && found.password === password) {
      setUser({ username, role: found.role });
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (username: string, password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 800));
    MOCK_USERS[username.toLowerCase()] = { password, role };
    return true;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const changePassword = useCallback(async (_current: string, _newPass: string) => {
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
