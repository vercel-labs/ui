import "@ui-sdk/web/menu"
import { Bell, Check, createElement, Mail, Smartphone } from "lucide"

const channels = [
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "Text message", icon: Smartphone },
  { value: "push", label: "Push", icon: Bell },
]

export function mount(root: HTMLElement) {
  let enabled = ["email", "push"]

  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>
            ${createElement(Bell, { "aria-hidden": "true" }).outerHTML}
            Notifications
          </button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-group>
            <ui-menu-group-label>Notify me by</ui-menu-group-label>
            ${channels
              .map(
                (channel) => `
                  <ui-menu-checkbox-item value="${channel.value}" checked="${enabled.includes(channel.value)}">
                    ${createElement(channel.icon, { "aria-hidden": "true" }).outerHTML}
                    ${channel.label}
                    ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                  </ui-menu-checkbox-item>
                `,
              )
              .join("")}
          </ui-menu-group>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">On: ${enabled.join(", ")}</output>
    </div>
  `
  root.addEventListener(
    "checkedchange",
    (event) => {
      const target = event.target as HTMLElement
      const value = target.getAttribute("value")!
      const checked = (event as CustomEvent<{ value: boolean }>).detail.value
      enabled = checked ? [...enabled, value] : enabled.filter((current) => current !== value)
      target.setAttribute("checked", String(checked))
      root.querySelector("output")!.textContent = enabled.length
        ? `On: ${enabled.join(", ")}`
        : "All notifications off"
    },
    { capture: true },
  )
}
