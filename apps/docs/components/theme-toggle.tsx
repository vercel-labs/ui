"use client"

import { Toggle, ToggleGroup } from "@/components/ui/toggle-group"
import { colorScheme } from "@/lib/preferences"
import type { ColorSchemeValue } from "@ui-sdk/core"
import { usePreference } from "@ui-sdk/react/preferences"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import * as React from "react"

const themes = [
  { value: "system", label: "System", icon: MonitorIcon },
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
] as const

const noSubscribe = () => () => {}

function ThemeToggle() {
  const { value } = usePreference(colorScheme)
  // The saved choice is only known after hydration, so the server's render
  // shows none pressed rather than the wrong one. The page's colors are right
  // before that, from `data-color-scheme`.
  const hydrated = React.useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false
  )

  return (
    <ToggleGroup
      aria-label="Theme"
      value={hydrated ? [value] : []}
      onValueChange={(next, details) => {
        // A pressed toggle stays pressed: there's always a theme.
        if (!next.length) {
          return
        }
        colorScheme.set(next[next.length - 1] as ColorSchemeValue, {
          reason: "item-press",
          event: details.event,
        })
      }}
    >
      {themes.map(({ value, label, icon: Icon }) => (
        <Toggle key={value} value={value} aria-label={label}>
          <Icon />
        </Toggle>
      ))}
    </ToggleGroup>
  )
}

export { ThemeToggle }
