"use client"

import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"
import { frameworkIds, frameworks, isFramework } from "@/lib/frameworks"
import { packageManager, styling, useFramework } from "@/lib/preferences"
import { usePreference } from "@ui-sdk/react/preferences"
import { cn } from "cn"
import * as React from "react"
import { CopyButton } from "./copy-button"
import { Frame } from "./frame"

function CodeBlockTabs({ className, children }: { className?: string; children: React.ReactNode }) {
  const { value } = usePreference(packageManager)
  return (
    <Frame className={cn("my-5 overflow-hidden", className)}>
      <Tabs
        data-copy-scope=""
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
    <TabBar>
      <TabsList aria-label={label}>{children}</TabsList>
      <CopyButton className="ms-auto size-[30px] shrink-0 rounded-[8px] hover:bg-muted" />
    </TabBar>
  )
}

function CodeBlockTabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTab value={value} className={value === "css" || value === "tailwind" ? undefined : "font-mono text-xs"}>
      {children}
    </TabsTab>
  )
}

function TabBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 items-center gap-2 border-b border-border/60 p-2", className)}
      {...props}
    />
  )
}

function CodeBlockTab({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsPanel
      value={value}
      className="outline-none [&>[data-code-frame]>button]:hidden [&>[data-code-frame]]:my-0 [&>[data-code-frame]]:rounded-none [&>[data-code-frame]]:bg-transparent [&>[data-code-frame]]:shadow-none [&>[data-code-frame]]:ring-0"
    >
      {children}
    </TabsPanel>
  )
}

// Two code blocks for the same styles: plain CSS first, then Tailwind classes.
function StyleTabs({ children }: { children: React.ReactNode }) {
  const { value } = usePreference(styling)
  const [css, tailwind] = React.Children.toArray(children)
  return (
    <Frame className="my-5 overflow-hidden">
      <Tabs
        data-copy-scope=""
        value={value}
        onValueChange={(next, details) => {
          if (next) styling.set(next as typeof value, details)
        }}
        className="flex flex-col"
      >
        <CodeBlockTabsList label="Styling">
          <CodeBlockTabsTrigger value="css">CSS</CodeBlockTabsTrigger>
          <CodeBlockTabsTrigger value="tailwind">Tailwind</CodeBlockTabsTrigger>
        </CodeBlockTabsList>
        <CodeBlockTab value="css">{css}</CodeBlockTab>
        <CodeBlockTab value="tailwind">{tailwind}</CodeBlockTab>
      </Tabs>
    </Frame>
  )
}

function FrameworkTabs({ children }: { children: React.ReactNode }) {
  const [framework, setFramework] = useFramework()
  return (
    <Frame className="my-5 overflow-hidden">
      <Tabs
        data-copy-scope=""
        value={framework}
        onValueChange={(next) => next && isFramework(next) && setFramework(next)}
        className="flex flex-col [&_[data-prompt-bar]]:hidden"
      >
        <TabBar>
          <TabsList aria-label="Framework">
            {frameworkIds.map((id) => (
              <TabsTab key={id} value={id}>
                {frameworks[id].label}
              </TabsTab>
            ))}
          </TabsList>
          <CopyButton label="Copy prompt" className="ms-auto shrink-0 rounded-[8px] max-sm:[&>span]:sr-only" />
        </TabBar>
        {children}
      </Tabs>
    </Frame>
  )
}

export { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, FrameworkTabs, StyleTabs, TabBar }
