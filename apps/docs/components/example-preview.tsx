"use client"

import "@/lib/examples-react"
import type { Framework } from "@/lib/frameworks"
import { ChevronRightIcon } from "lucide-react"
import * as React from "react"
import { preloadModule } from "react-dom"
import { cn } from "cn"

type Mount = (module: unknown, host: HTMLElement) => () => void
type ExampleRoot = React.ComponentType<{
  module: unknown
  log: (message: string) => void
}>

// Imports a compiled example from public/examples, so the docs app never bundles the examples.
const load = (url: string) =>
  import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)

const reactExamples = new Map<
  string,
  Promise<[unknown, { ExampleRoot: ExampleRoot }]>
>()

function ExamplePreview({
  name,
  framework,
  src,
  mount,
  preload,
  html,
  compact = false,
  tall = false,
  log = false,
}: {
  name: string
  framework: Framework
  src?: string
  mount?: string
  preload?: string[]
  html?: string
  compact?: boolean
  tall?: boolean
  log?: boolean
}) {
  const frame = React.useRef<HTMLDivElement>(null)
  const host = React.useRef<HTMLDivElement>(null)
  const [isNear, setNear] = React.useState(false)
  const [run, setRun] = React.useState(0)
  const [live, setLive] = React.useState(false)
  const [entries, setEntries] = React.useState<string[]>([])
  const isReact = framework === "react"

  const addEntry = React.useCallback(
    (message: string) => setEntries((list) => [...list, message].slice(-50)),
    []
  )

  // Examples load as they near the viewport, or when the reader reaches their
  // frame first. The prerendered HTML stands in until then.
  React.useEffect(() => {
    const element = frame.current
    const figure = element?.closest("figure")
    if (isNear || !element) {
      return
    }
    const approach = () => {
      preload?.forEach((url) => preloadModule(url))
      setNear(true)
    }
    const observer = new IntersectionObserver(
      (observed) => {
        if (observed.some((entry) => entry.isIntersecting)) {
          approach()
        }
      },
      { rootMargin: "100% 0px" }
    )
    observer.observe(element)
    figure?.addEventListener("focusin", approach)
    figure?.addEventListener("pointerenter", approach)
    return () => {
      observer.disconnect()
      figure?.removeEventListener("focusin", approach)
      figure?.removeEventListener("pointerenter", approach)
    }
  }, [isNear, preload])

  // The other frameworks' mounts turn each logged message into an event.
  React.useEffect(() => {
    const element = frame.current
    const add = (event: Event) =>
      addEntry((event as CustomEvent<string>).detail)
    element?.addEventListener("example-log", add)
    return () => element?.removeEventListener("example-log", add)
  }, [addEntry])

  // ResetButton asks for a fresh mount through an event on the example's figure.
  React.useEffect(() => {
    const figure = frame.current?.closest("figure")
    const reset = () => {
      setEntries([])
      setRun((count) => count + 1)
    }
    figure?.addEventListener("example-reset", reset)
    return () => figure?.removeEventListener("example-reset", reset)
  }, [])

  // Demo links point at `#`, which would scroll the docs page to the top when followed. The
  // document hears the click after the example's own handlers, which skip a prevented click.
  React.useEffect(() => {
    const element = frame.current
    const stay = (event: MouseEvent) => {
      const target = event.target as Element
      if (
        element &&
        event.composedPath().includes(element) &&
        target.closest?.('a[href="#"]')
      ) {
        event.preventDefault()
      }
    }
    document.addEventListener("click", stay)
    return () => document.removeEventListener("click", stay)
  }, [])

  React.useEffect(() => {
    if (!isNear) {
      return
    }
    if (!src || !mount) {
      console.error(
        `The ${name} example isn't built. Run \`pnpm --filter examples build\`.`
      )
      return
    }
    if (isReact) {
      return
    }
    let cleanup = () => {}
    let cancelled = false
    Promise.all([load(src), load(mount)])
      .then(([module, framework]: [unknown, { mount: Mount }]) => {
        const element = host.current
        if (cancelled || !element) {
          return
        }
        // Cleared in the same task the example mounts, so no frame shows an empty preview.
        element.replaceChildren()
        element.inert = false
        element.removeAttribute("aria-hidden")
        cleanup = framework.mount(module, element)
        setLive(true)
      })
      .catch((error) => {
        if (!cancelled) {
          console.error(
            `The ${name} example didn't load. Reload after a rebuild.`,
            error
          )
        }
      })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [name, src, mount, run, isNear, isReact])

  const content = "flex w-full max-w-full min-w-0 flex-col items-start gap-3"
  const prerendered = (
    <div
      inert
      aria-hidden
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
      className={content}
    />
  )
  const preview = (
    <div
      ref={frame}
      data-example={name}
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center overflow-x-auto px-6 text-foreground sm:px-10",
        compact ? "min-h-32 py-6" : tall ? "min-h-64 py-12" : "min-h-56 py-12"
      )}
    >
      {isReact && isNear && src && mount ? (
        <ExampleBoundary
          key={run}
          fallback={
            <p className="text-sm text-muted-foreground">
              This example didn&apos;t run.
            </p>
          }
        >
          <React.Suspense fallback={prerendered}>
            <div className={content}>
              <ReactExample
                name={name}
                src={src}
                mount={mount}
                log={addEntry}
              />
            </div>
          </React.Suspense>
        </ExampleBoundary>
      ) : (
        // A prerendered Preferences script writes its saved value before hydration.
        <div
          ref={host}
          inert={!live}
          aria-hidden={!live || undefined}
          suppressHydrationWarning
          dangerouslySetInnerHTML={html ? { __html: html } : undefined}
          className={content}
        />
      )}
    </div>
  )
  if (!log) {
    return preview
  }

  return (
    <div className="flex min-w-0 flex-col">
      {preview}
      <ExampleConsole entries={entries} />
    </div>
  )
}

function ReactExample({
  name,
  src,
  mount,
  log,
}: {
  name: string
  src: string
  mount: string
  log: (message: string) => void
}) {
  let loading = reactExamples.get(src)
  if (!loading) {
    loading = Promise.all([load(src), load(mount)])
    loading.catch((error) => {
      reactExamples.delete(src)
      console.error(
        `The ${name} example didn't load. Reload after a rebuild.`,
        error
      )
    })
    reactExamples.set(src, loading)
  }
  const [module, { ExampleRoot }] = React.use(loading)
  return <ExampleRoot module={module} log={log} />
}

// Keeps one throwing example from taking the page down with it.
class ExampleBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

// A fixed-height console under the preview, so logging never moves the example.
function ExampleConsole({ entries }: { entries: string[] }) {
  const list = React.useRef<HTMLOListElement>(null)
  React.useLayoutEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [entries])

  return (
    <section
      role="group"
      aria-label="Console"
      className="border-t border-border/60 text-xs"
    >
      <div className="border-b border-border/40 px-4 py-1.5 text-muted-foreground">
        Console
      </div>
      <ol
        ref={list}
        aria-live="polite"
        className="h-[6.5rem] overflow-y-auto px-4 py-1 font-mono leading-5 text-foreground/80"
      >
        {entries.map((entry, index) => (
          <li
            key={index}
            className="flex h-6 items-center border-b border-border/40"
          >
            {entry}
          </li>
        ))}
        <li
          aria-hidden
          className="flex h-6 items-center text-muted-foreground/60"
        >
          <ChevronRightIcon className="-ms-[5px] size-3.5" />
        </li>
      </ol>
    </section>
  )
}

export { ExamplePreview }
