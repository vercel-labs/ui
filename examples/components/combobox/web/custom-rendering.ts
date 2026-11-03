import "@ui-sdk/web/combobox"
import { Check, createElement, Search } from "lucide"

const users = [
  { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
  { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
  { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
  { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
  { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-combobox>
      <div data-slot="stack">
        <ui-combobox-label>Mention</ui-combobox-label>
        <div data-slot="row">
          ${createElement(Search, { "aria-hidden": "true" }).outerHTML}
          <ui-combobox-input>
            <input placeholder="@username" />
          </ui-combobox-input>
        </div>
      </div>
      <ui-combobox-content>
        <ui-combobox-empty>No one by that name.</ui-combobox-empty>
        <ui-combobox-list>
          ${users
            .map(
              (user) => `
                <ui-combobox-item value="${user.username}" label="${user.name}" keywords="${user.username}">
                  <span data-slot="badge">${user.name.slice(0, 1)}</span>
                  <span data-slot="stack">
                    ${user.name}
                    <span data-slot="hint">@${user.username}</span>
                  </span>
                  ${createElement(Check, { "data-show": "selected", "aria-hidden": "true" }).outerHTML}
                </ui-combobox-item>
              `,
            )
            .join("")}
        </ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>
  `
}
