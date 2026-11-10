import * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { Fixture } from "./react"

// Server renders, then the client hydrates. Every mismatch React reports is
// recorded, and the server's markup is kept for specs that read it.
function mount(root: HTMLElement) {
  const errors: string[] = []
  const page = window as unknown as {
    __hydrationErrors: string[]
    __serverMarkup: string
  }
  page.__hydrationErrors = errors
  const app = (
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
  root.innerHTML = page.__serverMarkup = renderToString(app)
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
