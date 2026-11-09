import * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { Fixture } from "./react"

// Server renders, then the client hydrates. Every mismatch React reports is recorded.
function mount(root: HTMLElement) {
  const errors: string[] = []
  ;(window as unknown as { __hydrationErrors: string[] }).__hydrationErrors =
    errors
  const app = (
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
  root.innerHTML = renderToString(app)
  // Whether open content shows before any script runs on it, as server HTML would.
  ;(
    window as unknown as { __visibleBeforeHydration: boolean }
  ).__visibleBeforeHydration = !!root
    .querySelector<HTMLElement>('[data-slot$="-content"]')
    ?.checkVisibility()
  const error = console.error
  console.error = (...args: unknown[]) => {
    errors.push(args.map(String).join(" "))
    error(...args)
  }
  hydrateRoot(root, app, {
    onRecoverableError: (cause) => errors.push(String(cause)),
  })
}

export { mount }
