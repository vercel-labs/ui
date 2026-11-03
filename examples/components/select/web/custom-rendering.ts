import "@ui-sdk/web/select"
import { Check, ChevronDown, createElement } from "lucide"

type Member = { id: number; name: string; email: string }

const members: Member[] = [
  { id: 1, name: "Ada Lovelace", email: "ada@example.com" },
  { id: 2, name: "Grace Hopper", email: "grace@example.com" },
  { id: 3, name: "Alan Turing", email: "alan@example.com" },
  { id: 4, name: "Margaret Hamilton", email: "margaret@example.com" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-select default-value="1">
      <div data-slot="stack">
        <ui-select-label>Reviewer</ui-select-label>
        <ui-select-trigger>
          <button>
            <ui-select-value>
              <span data-slot="badge"></span>
              <span></span>
            </ui-select-value>
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-select-trigger>
      </div>
      <ui-select-content>
        ${members
          .map(
            (member) => `
              <ui-select-item value="${member.id}" label="${member.name}" ${member.id === 4 ? "disabled" : ""}>
                <span data-slot="badge">
                  ${member.name.slice(0, 1)}
                </span>
                <span data-slot="stack">
                  ${member.name}
                  <span data-slot="hint">${member.id === 4 ? "Out of office" : member.email}</span>
                </span>
                <ui-select-item-indicator as-child>
                  <span>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</span>
                </ui-select-item-indicator>
              </ui-select-item>
            `,
          )
          .join("")}
      </ui-select-content>
    </ui-select>
  `
  const select = root.querySelector("ui-select")!
  const [avatar, label] = root.querySelectorAll("ui-select-value > span")
  const show = (value: string | null) => {
    const member = members.find((candidate) => String(candidate.id) === value)
    avatar.textContent = member?.name.slice(0, 1) ?? ""
    label.textContent = member?.name ?? ""
  }
  show("1")
  select.addEventListener("valuechange", (event) => {
    show((event as CustomEvent<{ value: string | null }>).detail.value)
  })
}
