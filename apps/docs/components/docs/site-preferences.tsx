"use client"

import { colorScheme } from "@/lib/theme"
import { Preferences } from "@ui-sdk/react/preferences"
import type { ReactNode } from "react"

// Puts the reader's color scheme on <html> before the first paint, from the
// script `Preferences` renders first, and keeps it there.
function SitePreferences({ children }: { children: ReactNode }) {
  return <Preferences preferences={[colorScheme]}>{children}</Preferences>
}

export { SitePreferences }
