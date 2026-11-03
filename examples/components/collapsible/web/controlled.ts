import "@ui-sdk/web/collapsible"
import { ChevronDown, createElement } from "lucide"

const recoveryCodes = ["7KQ2-M9XD", "P4TR-8HZC", "W3NB-6JUE", "C5YF-2LSA"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-collapsible>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            Recovery codes
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-collapsible-trigger>
        <ui-collapsible-panel>
          <div data-slot="stack">
            <p>Each code signs you in once if you lose your phone.</p>
            <ul data-slot="log">${recoveryCodes.map((code) => `<li>${code}</li>`).join("")}</ul>
            <button data-variant="secondary" data-action="done">Done</button>
          </div>
        </ui-collapsible-panel>
      </ui-collapsible>
      <button data-variant="secondary" data-action="toggle">Toggle from outside</button>
      <output data-slot="output">Closed</output>
    </div>
  `
  const collapsible = root.querySelector("ui-collapsible")!
  root.querySelector("[data-action=done]")!.addEventListener("click", () => (collapsible.open = false))
  root
    .querySelector("[data-action=toggle]")!
    .addEventListener("click", () => (collapsible.open = !collapsible.open))
  collapsible.addEventListener("openchange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: boolean; reason: string }>).detail
    root.querySelector("output")!.textContent = `${value ? "Open" : "Closed"}, last change: ${reason}`
  })
}

export { mount }
