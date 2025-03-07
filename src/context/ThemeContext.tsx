"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useColorScheme, AppState, type AppStateStatus } from "react-native"

type Theme = "light" | "dark" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDarkMode: boolean
  isLoading: boolean
}

const THEME_STORAGE_KEY = "user_theme_preference"

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  isDarkMode: false,
  isLoading: true,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [isLoading, setIsLoading] = useState(true)
  const systemColorScheme = useColorScheme()

  // Memoize the dark mode calculation to prevent unnecessary re-renders
  const isDarkMode = React.useMemo(
    () => (theme === "system" ? systemColorScheme === "dark" : theme === "dark"),
    [theme, systemColorScheme],
  )

  // Load saved theme preference from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setThemeState(savedTheme as Theme)
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [])

  // Listen for system theme changes when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && theme === "system") {
        // Force a re-render when app becomes active to capture any system theme changes
        setThemeState("system")
      }
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [theme])

  // Optimized theme update function with error handling
  const setTheme = useCallback(
    async (newTheme: Theme) => {
      if (newTheme === theme) return // Skip if theme hasn't changed

      setThemeState(newTheme)

      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme)
      } catch (error) {
        console.error("Failed to save theme preference:", error)
        // Consider showing a user-facing error message here
      }
    },
    [theme],
  )

  const contextValue = React.useMemo(
    () => ({
      theme,
      setTheme,
      isDarkMode,
      isLoading,
    }),
    [theme, setTheme, isDarkMode, isLoading],
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}

