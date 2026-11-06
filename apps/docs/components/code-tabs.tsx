"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
      <CopyButton className="ms-auto" />
    </TabBar>
  )
}

function CodeBlockTabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTab
      value={value}
      className={value === "css" || value === "tailwind" ? undefined : "font-mono text-xs"}
    >
      {children}
    </TabsTab>
  )
}

function TabBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-w-0 items-center gap-2 border-b border-border/60 p-frame", className)}
      {...props}
    />
  )
}

function CodeBlockTab({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsPanel
      value={value}
      className="outline-none [&>[data-code-frame]>[data-copy-float]]:hidden [&>[data-code-frame]]:my-0 [&>[data-code-frame]]:rounded-none [&>[data-code-frame]]:bg-transparent [&>[data-code-frame]]:shadow-none [&>[data-code-frame]]:ring-0"
    >
      {children}
    </TabsPanel>
  )
}

// Two code blocks for the same styles: plain CSS first, then Tailwind classes.
// The Tailwind tab can hold one block per framework, each in a FrameworkContent.
function StyleTabs({ children }: { children: React.ReactNode }) {
  const { value } = usePreference(styling)
  const [css, ...tailwind] = React.Children.toArray(children)
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

const frameworkItems = frameworkIds.map((value) => ({ value, label: frameworks[value].label }))

function FrameworkTabs({
  children,
  copyLabel = "Copy prompt",
}: {
  children: React.ReactNode
  copyLabel?: string
}) {
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
          <Select
            items={frameworkItems}
            value={framework}
            onValueChange={(next) => next && isFramework(next) && setFramework(next)}
          >
            <SelectTrigger
              variant="ghost"
              aria-label="Framework"
              className="mx-0 h-8 rounded-frame-control bg-muted px-3 text-[13px] font-medium hover:bg-muted data-open:bg-muted"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" sideOffset={6} className="min-w-44">
              {frameworkItems.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <CopyButton label={copyLabel} className="ms-auto max-sm:[&>span]:sr-only" />
        </TabBar>
        {children}
      </Tabs>
    </Frame>
  )
}

export {
  CodeBlockTab,
  CodeBlockTabs,
  CodeBlockTabsList,
  CodeBlockTabsTrigger,
  FrameworkTabs,
  StyleTabs,
  TabBar,
}
