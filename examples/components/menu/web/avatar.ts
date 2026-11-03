import "@ui-sdk/web/menu"
import { Check, createElement, LogOut, Settings, UserPlus } from "lucide"

const accounts = [
  { value: "personal", name: "Riley Park", initials: "RP" },
  { value: "studio", name: "North Studio", initials: "NS" },
]

function mount(root: HTMLElement) {
  let current = accounts[0]
  let action = ""

  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button aria-label="Account">${current.initials}</button>
        </ui-menu-trigger>
        <ui-menu-content align="end">
          <div data-slot="row">
            <span data-avatar data-slot="badge">${current.initials}</span>
            <div data-slot="stack">
              <div data-name>${current.name}</div>
              <div data-email data-slot="hint">${current.value}@example.com</div>
            </div>
          </div>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-radio-group value="${current.value}">
            <ui-menu-group-label>Switch account</ui-menu-group-label>
            ${accounts
              .map(
                (option) => `
                  <ui-menu-radio-item value="${option.value}" close-on-select>
                    <span data-slot="badge">${option.initials}</span>
                    ${option.name}
                    ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                  </ui-menu-radio-item>
                `,
              )
              .join("")}
          </ui-menu-radio-group>
          <ui-menu-item value="add-account">
            ${createElement(UserPlus, { "aria-hidden": "true" }).outerHTML}
            Add account
          </ui-menu-item>
          <ui-menu-separator></ui-menu-separator>
          <ui-menu-item value="settings">
            ${createElement(Settings, { "aria-hidden": "true" }).outerHTML}
            Settings
          </ui-menu-item>
          <ui-menu-item value="sign-out">
            ${createElement(LogOut, { "aria-hidden": "true" }).outerHTML}
            Sign out
          </ui-menu-item>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Signed in as ${current.name}</output>
    </div>
  `
  const show = () => {
    root.querySelector("output")!.textContent = action ? `Ran ${action}` : `Signed in as ${current.name}`
  }

  const avatars = root.querySelectorAll("button, [data-avatar]")
  const name = root.querySelector("[data-name]")!
  const email = root.querySelector("[data-email]")!
  const group = root.querySelector("ui-menu-radio-group")!
  group.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: string }>).detail
    const next = accounts.find((account) => account.value === value)!
    group.setAttribute("value", value)
    for (const avatar of avatars) {
      avatar.textContent = next.initials
    }
    name.textContent = next.name
    email.textContent = `${next.value}@example.com`
    current = next
    show()
  })
  root.addEventListener(
    "action",
    (event) => {
      action = (event as CustomEvent<{ value: string }>).detail.value
      show()
    },
    { capture: true },
  )
}

export { mount }
