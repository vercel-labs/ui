"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { createCodeTabPreference } from "@/lib/code-tab-preferences"
import { frameworkIds, frameworks, isFramework } from "@/lib/frameworks"
import { cn } from "cn"
import * as React from "react"
import { CopyButton } from "./copy-button"
import { frame } from "./frame"
import { useFramework } from "./remember-framework"

const groups = new Map<string, ReturnType<typeof createCodeTabPreference>>()

function useGroupValue(groupId: string | undefined, fallback: string, persist: boolean) {
  const preference = React.useMemo(() => {
    const options = {
      key: `tabs:${groupId}`,
      fallback,
      persist: !!groupId && persist,
    }
    if (!groupId) return createCodeTabPreference(options)
    const id = `${groupId}:${persist}`
    let group = groups.get(id)
    if (!group) {
      group = createCodeTabPreference(options)
      groups.set(id, group)
    }
    return group
  }, [groupId, fallback, persist])
  const value = React.useSyncExternalStore(
    preference.subscribe,
    preference.getSnapshot,
    preference.getServerSnapshot,
  )
  return [value, preference.set] as const
}

// Shared code tabs, including the package-manager tabs rendered by remark-npm.
function CodeBlockTabs({
  defaultValue = "",
  groupId,
  persist = true,
  className,
  children,
}: {
  defaultValue?: string
  groupId?: string
  persist?: boolean
  className?: string
  children: React.ReactNode
}) {
  const [value, setValue] = useGroupValue(groupId, defaultValue, persist)
  return (
    <Tabs
      value={value}
      onValueChange={(next) => next && setValue(next)}
      className={cn("my-5 flex flex-col", frame, className)}
    >
      {children}
    </Tabs>
  )
}

function CodeBlockTabsList({
  children,
  label = "Package manager",
}: {
  children: React.ReactNode
  label?: string
}) {
  return (
    <TabsList aria-label={label} className="border-b border-border/60 px-4 py-2.5">
      {children}
    </TabsList>
  )
}

function CodeBlockTabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return <TabsTab value={value}>{children}</TabsTab>
}

function CodeBlockTab({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsPanel
      value={value}
      className="outline-none [&>[data-code-frame]]:my-0 [&>[data-code-frame]]:rounded-none [&>[data-code-frame]]:bg-transparent [&>[data-code-frame]]:shadow-none [&>[data-code-frame]]:ring-0"
    >
      {children}
    </TabsPanel>
  )
}

// A prompt for each framework, sharing its choice with the header's framework
// picker. The copy button copies the open tab's prompt.
function FrameworkTabs({ children }: { children: React.ReactNode }) {
  const [framework, setFramework] = useFramework()
  return (
    <Tabs
      data-copy-scope=""
      value={framework}
      onValueChange={(next) => next && isFramework(next) && setFramework(next)}
      className={cn("my-5 flex flex-col [&_[data-prompt-bar]]:hidden", frame)}
    >
      <div className="flex items-center gap-2 border-b border-border/60 py-1.5 ps-4 pe-2">
        <TabsList aria-label="Framework" className="min-w-0 overflow-x-auto scrollbar-none">
          {frameworkIds.map((id) => (
            <TabsTab key={id} value={id} className="shrink-0">
              {frameworks[id].label}
            </TabsTab>
          ))}
        </TabsList>
        <CopyButton label="Copy prompt" className="ms-auto shrink-0 max-sm:[&>span]:sr-only" />
      </div>
      {children}
    </Tabs>
  )
}

export { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, FrameworkTabs }
