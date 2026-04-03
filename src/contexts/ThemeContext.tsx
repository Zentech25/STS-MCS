import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "zen";

const THEME_ORDER: Theme[] = ["light", "dark", "zen"];

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("sim_theme");
    if (saved === "dark" || saved === "light" || saved === "zen") return saved;
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("sim_theme", theme);
    const cl = document.documentElement.classList;
    cl.remove("dark", "zen");
    if (theme !== "light") cl.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const i = THEME_ORDER.indexOf(prev);
      return THEME_ORDER[(i + 1) % THEME_ORDER.length];
    });
  }, []);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
