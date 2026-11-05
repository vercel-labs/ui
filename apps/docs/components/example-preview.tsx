"use client"

import { ChevronRightIcon } from "lucide-react"
import * as React from "react"
import { cn } from "cn"

type Mount = (module: unknown, host: HTMLElement) => () => void

// Imports a compiled example from public/examples, so the docs app never bundles the examples.
const load = (url: string) => import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)

function ExamplePreview({
  name,
  src,
  mount,
  compact = false,
  tall = false,
  log = false,
}: {
  name: string
  src?: string
  mount?: string
  compact?: boolean
  tall?: boolean
  log?: boolean
}) {
  const host = React.useRef<HTMLDivElement>(null)
  const [run, setRun] = React.useState(0)
  const [entries, setEntries] = React.useState<string[]>([])

  // Examples log through `useLog()`; the mount turns each message into an event on the host.
  React.useEffect(() => {
    const element = host.current
    const add = (event: Event) =>
      setEntries((list) => [...list, (event as CustomEvent<string>).detail].slice(-50))
    element?.addEventListener("example-log", add)
    return () => element?.removeEventListener("example-log", add)
  }, [])

  // ResetButton asks for a fresh mount through an event on the example's figure.
  React.useEffect(() => {
    const figure = host.current?.closest("figure")
    const reset = () => setRun((count) => count + 1)
    figure?.addEventListener("example-reset", reset)
    return () => figure?.removeEventListener("example-reset", reset)
  }, [])

  // Demo links point at `#`, which would scroll the docs page to the top when followed. The
  // document hears the click after the example's own handlers, which skip a prevented click.
  React.useEffect(() => {
    const element = host.current
    const stay = (event: MouseEvent) => {
      const target = event.target as Element
      if (element && event.composedPath().includes(element) && target.closest?.('a[href="#"]'))
        event.preventDefault()
    }
    document.addEventListener("click", stay)
    return () => document.removeEventListener("click", stay)
  }, [])

  React.useEffect(() => {
    setEntries([])
    if (!src || !mount) {
      console.error(`The ${name} example isn't built. Run \`pnpm --filter examples build\`.`)
      return
    }
    let cleanup = () => {}
    let cancelled = false
    Promise.all([load(src), load(mount)])
      .then(([module, framework]: [unknown, { mount: Mount }]) => {
        if (cancelled || !host.current) return
        cleanup = framework.mount(module, host.current)
      })
      .catch((error) => {
        if (!cancelled) console.error(`The ${name} example didn't load. Reload after a rebuild.`, error)
      })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [name, src, mount, run])

  const preview = (
    <div
      data-example={name}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center overflow-x-auto px-6 text-foreground sm:px-10",
        compact ? "min-h-32 py-6" : tall ? "min-h-64 py-12" : "min-h-56 py-12",
      )}
    >
      <div ref={host} className="flex w-full max-w-full min-w-0 flex-col items-start gap-3" />
    </div>
  )
  if (!log) return preview

  return (
    <div className="flex min-w-0 flex-col">
      {preview}
      <ExampleConsole entries={entries} />
    </div>
  )
}

// A fixed-height console under the preview, so logging never moves the example.
function ExampleConsole({ entries }: { entries: string[] }) {
  const list = React.useRef<HTMLOListElement>(null)
  React.useLayoutEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [entries])

  return (
    <section role="group" aria-label="Console" className="border-t border-border/60 text-xs">
      <div className="border-b border-border/40 px-4 py-1.5 text-muted-foreground">Console</div>
      <ol
        ref={list}
        aria-live="polite"
        className="h-[6.5rem] overflow-y-auto px-4 py-1 font-mono leading-5 text-foreground/80"
      >
        {entries.map((entry, index) => (
          <li key={index} className="flex h-6 items-center border-b border-border/40">
            {entry}
          </li>
        ))}
        <li aria-hidden className="flex h-6 items-center text-muted-foreground/60">
          <ChevronRightIcon className="-ms-[5px] size-3.5" />
        </li>
      </ol>
    </section>
  )
}

export { ExamplePreview }
