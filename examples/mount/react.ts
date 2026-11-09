import { createElement, StrictMode, type ComponentType } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import { LogContext } from "../shared/react/log"

// The docs preview shows logged messages in its console pane.
export function mount(module: { Example: ComponentType }, host: HTMLElement) {
  const log = (message: string) =>
    host.dispatchEvent(
      new CustomEvent("example-log", { bubbles: true, detail: message })
    )
  const root = createRoot(host)
  // Synchronous, so the docs' prerendered HTML is replaced within one frame.
  flushSync(() =>
    root.render(
      createElement(
        StrictMode,
        null,
        createElement(
          LogContext.Provider,
          { value: log },
          createElement(module.Example)
        )
      )
    )
  )
  return () => root.unmount()
}
