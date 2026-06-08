import { useEffect, useState } from "react";

const STORAGE_KEY = "antares-dark-mode";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(darkMode));
    } catch {
      // localStorage no disponible
    }
  }, [darkMode]);

  return { darkMode, setDarkMode };
}