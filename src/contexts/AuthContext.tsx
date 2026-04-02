import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type UserRole = "instructor" | "administrator" | "engineer";

export interface User {
  username: string;
  role: UserRole;
}

interface StoredUser {
  password: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  changePassword: (username: string, current: string, newPass: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "sim_users";

function getStoredUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Default demo accounts
  return {
    instructor: { password: "demo", role: "instructor" },
    admin: { password: "demo", role: "administrator" },
    engineer: { password: "demo", role: "engineer" },
  };
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, StoredUser>>(getStoredUsers);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise((r) => setTimeout(r, 600));
    const found = users[username.toLowerCase()];
    if (found && found.password === password) {
      setUser({ username, role: found.role });
      return true;
    }
    return false;
  }, [users]);

  const signup = useCallback(async (username: string, password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 600));
    const key = username.toLowerCase();
    if (users[key]) return false; // already exists
    const updated = { ...users, [key]: { password, role } };
    setUsers(updated);
    return true;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const changePassword = useCallback(async (username: string, current: string, newPass: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const key = username.toLowerCase();
    const found = users[key];
    if (!found || found.password !== current) return false;
    const updated = { ...users, [key]: { ...found, password: newPass } };
    setUsers(updated);
    return true;
  }, [users]);

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
