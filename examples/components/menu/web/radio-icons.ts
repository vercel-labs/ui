import "@ui-sdk/web/menu"
import { Check, createElement, CreditCard, Landmark, Wallet } from "lucide"

const methods = [
  { value: "card", label: "Credit card", icon: CreditCard },
  { value: "wallet", label: "Wallet", icon: Wallet },
  { value: "bank", label: "Bank transfer", icon: Landmark, disabled: true },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu>
        <ui-menu-trigger>
          <button>
            ${createElement(CreditCard, { "aria-hidden": "true" }).outerHTML}
            Payment method
          </button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-radio-group value="card">
            <ui-menu-group-label>Pay with</ui-menu-group-label>
            ${methods
              .map(
                (option) => `
                  <ui-menu-radio-item value="${option.value}" ${option.disabled ? "disabled" : ""}>
                    ${createElement(option.icon, { "aria-hidden": "true" }).outerHTML}
                    ${option.label}
                    ${createElement(Check, { "aria-hidden": "true" }).outerHTML}
                  </ui-menu-radio-item>
                `,
              )
              .join("")}
          </ui-menu-radio-group>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Paying with credit card</output>
    </div>
  `
  const group = root.querySelector("ui-menu-radio-group")!
  group.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: string }>).detail
    const current = methods.find((option) => option.value === value)!
    group.setAttribute("value", value)
    root.querySelector("button svg")!.replaceWith(createElement(current.icon, { "aria-hidden": "true" }))
    root.querySelector("output")!.textContent = `Paying with ${current.label.toLowerCase()}`
  })
}
