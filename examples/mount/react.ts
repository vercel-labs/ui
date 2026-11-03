import { createElement, StrictMode, type ComponentType } from "react"
import { createRoot } from "react-dom/client"
import { LogContext } from "../shared/react/log"

// The docs preview shows logged messages in its console pane.
export function mount(module: { Example: ComponentType }, host: HTMLElement) {
  const log = (message: string) =>
    host.dispatchEvent(new CustomEvent("example-log", { bubbles: true, detail: message }))
  const root = createRoot(host)
  root.render(
    createElement(
      StrictMode,
      null,
      createElement(LogContext.Provider, { value: log }, createElement(module.Example)),
    ),
  )
  return () => root.unmount()
}
