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
    <div data-slot="stack">
      <ui-combobox name="reviewer">
        <div data-slot="stack">
          <ui-combobox-label>Reviewer</ui-combobox-label>
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
                (item) => `
                  <ui-combobox-item value="${item.id}" label="${item.name}">
                    ${item.name}
                    <ui-combobox-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-combobox-item-indicator>
                  </ui-combobox-item>
                `,
              )
              .join("")}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
      <output data-slot="output"></output>
    </div>
  `
  const combobox = root.querySelector("ui-combobox") as HTMLElement & {
    items: { value: (typeof users)[number]; label: string }[]
    itemToValue: (user: (typeof users)[number]) => string
    itemToLabel: (user: (typeof users)[number]) => string
    value: (typeof users)[number] | null
  }
  const output = root.querySelector("output")!
  combobox.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: (typeof users)[number] | null }>).detail
    output.textContent = `Submits reviewer=${value ? value.id : ""}`
  })
  combobox.items = users.map((user) => ({ value: user, label: user.name }))
  combobox.itemToValue = (user) => String(user.id)
  combobox.itemToLabel = (user) => user.name
  combobox.value = { ...users[2] }
}

export { mount }
