import * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { Fixture } from "./react"

function mount(root: HTMLElement) {
  const errors: string[] = []
  ;(window as unknown as { __hydrationErrors: string[] }).__hydrationErrors = errors
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
    hydrateRoot(root, app, { onRecoverableError: (cause) => errors.push(String(cause)) })
  }
  if (new URLSearchParams(location.search).get("hydrate") === "manual")
    (window as unknown as { hydrate: () => void }).hydrate = hydrate
  else hydrate()
}

export { mount }
