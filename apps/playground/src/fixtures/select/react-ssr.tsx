import * as React from "react"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { serializeForm } from "tests/fixtures/select.ts"
import { Fixture } from "./react"

// Server renders, then the client hydrates. Every mismatch React reports is recorded.
function mount(root: HTMLElement) {
  const errors: string[] = []
  ;(window as unknown as { __hydrationErrors: string[] }).__hydrationErrors =
    errors
  // ?data renders the same select from `items`.
  const app = (
    <React.StrictMode>
      <Fixture data={new URLSearchParams(location.search).has("data")} />
    </React.StrictMode>
  )
  root.innerHTML = renderToString(app)
  // What the page shows before hydration.
  ;(window as unknown as { __serverHtml: string }).__serverHtml = root.innerHTML
  // What the server markup submits before any script runs on it.
  const form = root.querySelector("form")
  ;(window as unknown as { __serverForm: string }).__serverForm = form
    ? serializeForm(form)
    : ""
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
