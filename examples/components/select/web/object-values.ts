import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

type Member = { id: number; name: string; email: string }

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com" },
  { id: 3, name: "Alan Turing", email: "alan@example.com" },
  { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-select name="assignee" placeholder="Unassigned">
        <div data-slot="stack">
          <ui-select-label>Assignee</ui-select-label>
          <ui-select-trigger>
            <button>
              <ui-select-value></ui-select-value>
              ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </div>
        <ui-select-content>
          ${members
            .map(
              (member) => `
                <ui-select-item value="${member.id}">
                  <span>${member.name}</span>
                  <span data-slot="hint">${member.email}</span>
                  <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                </ui-select-item>
              `,
            )
            .join("")}
        </ui-select-content>
      </ui-select>
      <output data-slot="output"></output>
    </div>
  `
  const select = root.querySelector("ui-select") as HTMLElement & {
    items: { value: Member; label: string }[]
    itemToValue: (member: Member) => string
    itemToLabel: (member: Member) => string
    value: Member | null
  }
  const output = root.querySelector("output")!
  select.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: Member | null }>).detail
    output.textContent = `Submits assignee=${value ? value.id : ""}`
  })
  select.items = members.map((member) => ({ value: member, label: member.name }))
  select.itemToValue = (member) => String(member.id)
  select.itemToLabel = (member) => member.name
  select.value = { ...members[1] }
}

export { mount }
