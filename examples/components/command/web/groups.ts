import "@ui-sdk/web/command"
import { Calculator, Calendar, createElement, CreditCard, Settings, Smile, User } from "lucide"

const groups = [
  {
    label: "Suggestions",
    items: [
      { value: "calendar", label: "Calendar", icon: Calendar },
      { value: "emoji", label: "Search Emoji", icon: Smile },
      { value: "calculator", label: "Calculator", icon: Calculator },
    ],
  },
  {
    label: "Settings",
    items: [
      { value: "profile", label: "Profile", icon: User },
      { value: "billing", label: "Billing", icon: CreditCard },
      { value: "settings", label: "Settings", icon: Settings },
    ],
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-command>
      <ui-command-input>
        <input aria-label="Search commands" placeholder="Type a command or search..." />
      </ui-command-input>
      <ui-command-empty>No results found.</ui-command-empty>
      <ui-command-list>
        ${groups
          .map(
            (group, index) => `
              ${index > 0 ? `<ui-command-separator></ui-command-separator>` : ""}
              <ui-command-group>
                <ui-command-group-label>${group.label}</ui-command-group-label>
                ${group.items
                  .map(
                    (item) => `
                      <ui-command-item value="${item.value}">
                        <ui-command-item-icon>${createElement(item.icon, { "aria-hidden": "true" }).outerHTML}</ui-command-item-icon>
                        ${item.label}
                      </ui-command-item>
                    `,
                  )
                  .join("")}
              </ui-command-group>
            `,
          )
          .join("")}
      </ui-command-list>
    </ui-command>
  `
}

export { mount }
