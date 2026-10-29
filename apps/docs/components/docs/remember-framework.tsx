"use client"

import type { Framework } from "@/lib/frameworks"
import { framework as preference } from "@/lib/preferences"
import { usePreference } from "@ui-sdk/react/preferences"
import * as React from "react"

function setFramework(framework: Framework) {
  preference.set(framework)
}

/** The saved framework choice, or undefined before the reader has made one. */
function useSavedFramework() {
  return usePreference(preference).value || undefined
}

/** The shared framework preference, else React, persisted for links and server redirects. */
function useFramework() {
  const framework = useSavedFramework() ?? "react"
  return [framework, setFramework] as const
}

// Remembers the framework being read, so links from Core and Agents, like
// /docs/components/field, go to its pages.
function RememberFramework({ framework }: { framework: Framework }) {
  React.useEffect(() => {
    setFramework(framework)
  }, [framework])
  return null
}

export { RememberFramework, setFramework, useFramework, useSavedFramework }
