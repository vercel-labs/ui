"use client"

import { frameworks, type Framework } from "@/lib/frameworks"
import * as React from "react"
import { cn } from "cn"

type Mount = (module: unknown, host: HTMLElement) => () => void

// Imports a compiled example from public/examples, which examples/vite.config.ts
// builds, so the docs app never bundles them. ComponentExample preloads its files.
const load = (url: string) => import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url)

function ExamplePreview({
  name,
  framework,
  compact = false,
  tall = false,
}: {
  name: string
  framework: Framework
  compact?: boolean
  tall?: boolean
}) {
  const host = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const base = `/examples/${frameworks[framework].example}`
    let cleanup = () => {}
    let cancelled = false
    Promise.all([load(`${base}/${name}.js`), load(`${base}/mount.js`)])
      .then(([module, { mount }]: [unknown, { mount: Mount }]) => {
        if (cancelled || !host.current) return
        cleanup = mount(module, host.current)
      })
      .catch((error) => {
        console.error(`The ${name} example didn't load. Run \`pnpm --filter examples build\`.`, error)
      })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [name, framework])

  return (
    <div
      data-example={name}
      className={cn(
        "flex flex-col items-center justify-center px-6 text-foreground sm:px-10",
        compact ? "min-h-32 py-6" : tall ? "min-h-64 py-12" : "min-h-56 py-12",
      )}
    >
      <div ref={host} className="contents" />
    </div>
  )
}

export { ExamplePreview }
