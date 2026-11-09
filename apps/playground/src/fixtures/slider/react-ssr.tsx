import * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { Fixture } from "./react"

// Server renders, then the client hydrates. Every mismatch React reports is
// recorded. With ?hydrate=manual, the page stays server markup until
// window.hydrate() runs, so specs can use the sliders before hydration.
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
  const hydrate = () => {
    const error = console.error
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "))
      error(...args)
    }
    hydrateRoot(root, app, {
      onRecoverableError: (cause) => errors.push(String(cause)),
    })
  }
  if (new URLSearchParams(location.search).get("hydrate") === "manual") {
    ;(window as unknown as { hydrate: () => void }).hydrate = hydrate
  } else {
    hydrate()
  }
}

export { mount }
