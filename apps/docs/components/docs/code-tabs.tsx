"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { frameworkIds, frameworks, isFramework } from "@/lib/frameworks"
import { packageManager } from "@/lib/preferences"
import { usePreference } from "@ui-sdk/react/preferences"
import { cn } from "cn"
import * as React from "react"
import { CopyButton } from "./copy-button"
import { frame } from "./frame"
import { useFramework } from "./remember-framework"

// The package-manager tabs remark-npm renders.
function CodeBlockTabs({ className, children }: { className?: string; children: React.ReactNode }) {
  const { value } = usePreference(packageManager)
  return (
    <Tabs
      value={value}
      onValueChange={(next, details) => {
        // A cast: `set` ignores a value that isn't a package manager.
        if (next) packageManager.set(next as typeof value, details)
      }}
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
