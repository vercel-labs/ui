"use client"

import { colorScheme, framework, packageManager } from "@/lib/preferences"
import { Preferences } from "@ui-sdk/react/preferences"
import type { ReactNode } from "react"

const preferences = [colorScheme, framework, packageManager]

// Puts the saved preferences on <html> before the first paint.
function SitePreferences({ children }: { children: ReactNode }) {
  return <Preferences preferences={preferences}>{children}</Preferences>
}

export { SitePreferences }
