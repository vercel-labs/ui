import "@ui-sdk/web/toggle"
import { Bell, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-toggle default-pressed>
        <button>
          <ui-toggle-icon data-variant="fill">${createElement(Bell, { "aria-hidden": "true" }).outerHTML}</ui-toggle-icon>
          Notifications
        </button>
      </ui-toggle>
      <button type="button" data-outside>Toggle from outside</button>
      <output data-slot="output">Notifications: on</output>
    </div>
  `
  const notifications = root.querySelector("ui-toggle")!
  root.querySelector("[data-outside]")!.addEventListener("click", () => notifications.api.toggle())
  notifications.addEventListener("pressedchange", (event) => {
    const { value, reason } = event.detail
    root.querySelector("output")!.textContent =
      `Notifications: ${value ? "on" : "off"}, last change: ${reason}`
  })
}

export { mount }
