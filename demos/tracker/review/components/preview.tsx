"use client"

import { cn } from "cn"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Monitor,
  RotateCw,
  ScanSearch,
  Smartphone,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import type { Root } from "@/lib/files"
import { frameworkCookie, type Framework } from "@/lib/frameworks"
import { inspect, type Inspection } from "@/lib/inspect"

function startInspecting(
  frame: HTMLIFrameElement,
  onPick: (element: Element) => void,
  onStop: () => void
) {
  const view = frame.contentWindow
  const doc = frame.contentDocument
  if (!view || !doc?.body) {
    return () => {}
  }
  const box = doc.createElement("div")
  box.style.cssText =
    "position:fixed;z-index:2147483647;pointer-events:none;border:2px solid #3b82f6;background:rgb(59 130 246 / 0.12);border-radius:3px;display:none"
  const label = doc.createElement("div")
  label.style.cssText =
    "position:absolute;left:-2px;bottom:100%;margin-bottom:2px;padding:1px 5px;border-radius:3px;background:#3b82f6;color:white;font:11px ui-monospace,monospace;white-space:nowrap"
  box.append(label)
  doc.body.append(box)
  const show = (event: Event) => {
    const target = event.target as Element
    if (!target || target.nodeType !== 1) {
      return
    }
    const rect = target.getBoundingClientRect()
    Object.assign(box.style, {
      display: "block",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    })
    const part = target.closest("[data-slot]")?.getAttribute("data-slot")
    label.textContent = part
      ? `${target.tagName.toLowerCase()} · ${part}`
      : target.tagName.toLowerCase()
  }
  const block = (event: Event) => {
    event.preventDefault()
    event.stopImmediatePropagation()
  }
  const pick = (event: Event) => {
    block(event)
    onPick(event.target as Element)
    onStop()
  }
  const escape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return
    }
    block(event)
    onStop()
  }
  const blocked = [
    "pointerdown",
    "pointerup",
    "mousedown",
    "mouseup",
    "dblclick",
    "contextmenu",
  ] as const
  view.addEventListener("pointermove", show, true)
  view.addEventListener("click", pick, true)
  view.addEventListener("keydown", escape, true)
  for (const type of blocked) {
    view.addEventListener(type, block, true)
  }
  return () => {
    box.remove()
    view.removeEventListener("pointermove", show, true)
    view.removeEventListener("click", pick, true)
    view.removeEventListener("keydown", escape, true)
    for (const type of blocked) {
      view.removeEventListener(type, block, true)
    }
  }
}

function Preview({
  framework,
  initialPath,
  roots,
  files,
  onNavigate,
  onInspect,
}: {
  framework: Framework
  initialPath: string
  roots: Root[]
  files: Set<string>
  onNavigate: (path: string) => void
  onInspect: (inspection: Inspection) => void
}) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [src, setSrc] = useState<string | null>(null)
  const [path, setPath] = useState(initialPath)
  const [draft, setDraft] = useState(initialPath)
  const [phone, setPhone] = useState(false)
  const [inspecting, setInspecting] = useState(false)
  const [loads, setLoads] = useState(0)

  useEffect(() => {
    document.cookie = `${frameworkCookie}=${framework}; path=/; SameSite=Lax`
    setSrc(initialPath)
  }, [framework, initialPath])

  useEffect(() => {
    const timer = setInterval(() => {
      const location = frame.current?.contentWindow?.location
      if (!location || location.href === "about:blank") {
        return
      }
      const next = location.pathname + location.search
      if (next === path) {
        return
      }
      setPath(next)
      setDraft(next)
      onNavigate(next)
    }, 300)
    return () => clearInterval(timer)
  }, [path, onNavigate])

  useEffect(() => {
    if (!inspecting || !frame.current) {
      return
    }
    frame.current.focus()
    return startInspecting(
      frame.current,
      (element) => onInspect(inspect(element, framework, roots, files)),
      () => setInspecting(false)
    )
  }, [inspecting, loads, framework, roots, files, onInspect])

  const go = (to: string) => {
    const location = frame.current?.contentWindow?.location
    if (location) {
      location.assign(to.startsWith("/") ? to : `/${to}`)
    }
  }

  const button =
    "flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border px-2">
        <button
          type="button"
          aria-label="Back"
          className={button}
          onClick={() => frame.current?.contentWindow?.history.back()}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Forward"
          className={button}
          onClick={() => frame.current?.contentWindow?.history.forward()}
        >
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Reload"
          className={button}
          onClick={() => frame.current?.contentWindow?.location.reload()}
        >
          <RotateCw aria-hidden="true" className="size-3.5" />
        </button>
        <form
          className="min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            go(draft)
          }}
        >
          <input
            aria-label="Preview address"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="h-7 w-full rounded-md bg-muted px-2 font-mono text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </form>
        <button
          type="button"
          aria-label="Inspect"
          aria-pressed={inspecting}
          title="Click anything in the app to open its code"
          className={cn(
            button,
            inspecting &&
              "bg-blue-500/15 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600"
          )}
          onClick={() => setInspecting((current) => !current)}
        >
          <ScanSearch aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          aria-label={phone ? "Desktop width" : "Phone width"}
          className={button}
          onClick={() => setPhone((current) => !current)}
        >
          {phone ? (
            <Monitor aria-hidden="true" className="size-4" />
          ) : (
            <Smartphone aria-hidden="true" className="size-4" />
          )}
        </button>
        <a
          href={path}
          target="_blank"
          rel="noreferrer"
          aria-label="Open in a new tab"
          className={button}
        >
          <ExternalLink aria-hidden="true" className="size-3.5" />
        </a>
      </div>
      <div className="flex min-h-0 flex-1 justify-center bg-muted/50">
        {src !== null && (
          <iframe
            ref={frame}
            key={framework}
            src={src}
            title={`Tracker preview (${framework})`}
            onLoad={() => setLoads((count) => count + 1)}
            className={cn(
              "h-full bg-background",
              phone ? "w-[390px] border-x border-border" : "w-full"
            )}
          />
        )}
      </div>
    </div>
  )
}

export { Preview }
