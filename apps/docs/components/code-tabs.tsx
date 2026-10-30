"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { frameworkIds, frameworks, isFramework } from "@/lib/frameworks"
import { packageManager, useFramework } from "@/lib/preferences"
import { usePreference } from "@ui-sdk/react/preferences"
import { cn } from "cn"
import * as React from "react"
import { CopyButton } from "./copy-button"
import { Frame } from "./frame"

function CodeBlockTabs({ className, children }: { className?: string; children: React.ReactNode }) {
  const { value } = usePreference(packageManager)
  return (
    <Frame className={cn("my-5", className)}>
      <Tabs
        value={value}
        onValueChange={(next, details) => {
          if (next) packageManager.set(next as typeof value, details)
        }}
        className="flex flex-col"
      >
        {children}
      </Tabs>
    </Frame>
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

function FrameworkTabs({ children }: { children: React.ReactNode }) {
  const [framework, setFramework] = useFramework()
  return (
    <Frame className="my-5">
      <Tabs
        data-copy-scope=""
        value={framework}
        onValueChange={(next) => next && isFramework(next) && setFramework(next)}
        className="flex flex-col [&_[data-prompt-bar]]:hidden"
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
    </Frame>
  )
}

export { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, FrameworkTabs }
