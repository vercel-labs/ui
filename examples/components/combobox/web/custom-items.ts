import "@ui-sdk/web/combobox"
import { Check, ChevronDown, createElement } from "lucide"

const users = [
  { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
  { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
  { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
  { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
  { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-combobox>
      <div data-slot="stack">
        <ui-combobox-label>Owner</ui-combobox-label>
        <div data-slot="row">
          <ui-combobox-input>
            <input placeholder="Search people" />
          </ui-combobox-input>
          <ui-combobox-trigger>
            <button aria-label="Show people">${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}</button>
          </ui-combobox-trigger>
        </div>
      </div>
      <ui-combobox-content>
        <ui-combobox-empty>No people found.</ui-combobox-empty>
        <ui-combobox-list>
          ${users
            .map(
              (user) => `
                <ui-combobox-item value="${user.username}" label="${user.name}" keywords="${user.username}">
                  <span data-slot="badge">${user.name.slice(0, 1)}</span>
                  <span data-slot="stack">
                    <span>${user.name}</span>
                    <span data-slot="hint">@${user.username}</span>
                  </span>
                  <span data-slot="hint">${user.role}</span>
                  <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
                </ui-combobox-item>
              `,
            )
            .join("")}
        </ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>
  `
}

export { mount }
