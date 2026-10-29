"use client"

import { colorScheme, framework, packageManager } from "@/lib/preferences"
import { Preferences } from "@ui-sdk/react/preferences"
import type { ReactNode } from "react"

const preferences = [colorScheme, framework, packageManager]

// Puts the reader's color scheme, framework and package manager on <html>
// before the first paint, from the script `Preferences` renders first, and
// keeps them there.
function SitePreferences({ children }: { children: ReactNode }) {
  return <Preferences preferences={preferences}>{children}</Preferences>
}

export { SitePreferences }
