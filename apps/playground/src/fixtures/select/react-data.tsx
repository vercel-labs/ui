import * as React from "react"
import { createRoot } from "react-dom/client"
import { Fixture } from "./react"

// The same select, rendered from `items`.
function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture data />
    </React.StrictMode>
  )
}

export { mount }
