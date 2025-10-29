
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"
import { useFirebase } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"
import { updateUserThemeAction } from "@/app/actions"

function ThemeSync() {
  const { theme, setTheme } = useTheme()
  const { user, firestore, isUserLoading } = useFirebase()

  // Effect to load theme from Firestore on user load
  React.useEffect(() => {
    if (user && firestore) {
      const userDocRef = doc(firestore, "users", user.uid)
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data()
          if (userData.theme && userData.theme !== theme) {
            setTheme(userData.theme)
          }
        }
      })
    }
  }, [user, firestore, setTheme, theme])

  // Effect to save theme to Firestore when changed
  React.useEffect(() => {
    if (user && theme) {
      // We prevent saving the 'system' preference, as it should be resolved locally
      const themeToSave = theme === 'system' ? undefined : theme;
      if (themeToSave) {
          updateUserThemeAction(themeToSave)
      }
    }
  }, [theme, user])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <ThemeSync />
    </NextThemesProvider>
  )
}

    