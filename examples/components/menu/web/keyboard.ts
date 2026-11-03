import "@ui-sdk/web/menu"

const statuses = [
  { value: "online", label: "Online", hint: "Visible to everyone" },
  { value: "away", label: "Away", hint: "Shown as idle" },
  { value: "busy", label: "Do not disturb", hint: "Notifications are muted" },
  { value: "invisible", label: "Invisible", hint: "Appear offline" },
]

function mount(root: HTMLElement) {
  let current = statuses[0]

  root.innerHTML = `
    <div data-slot="stack">
      <ui-menu loop="false">
        <ui-menu-trigger>
          <button>
            <span data-label>${current.label}</span>
          </button>
        </ui-menu-trigger>
        <ui-menu-content>
          <ui-menu-radio-group value="${current.value}">
            ${statuses
              .map(
                (option) => `
                  <ui-menu-radio-item value="${option.value}" label="${option.label}" close-on-select>
                    <span data-slot="stack">
                      ${option.label}
                      <span data-slot="hint">${option.hint}</span>
                    </span>
                  </ui-menu-radio-item>
                `,
              )
              .join("")}
          </ui-menu-radio-group>
        </ui-menu-content>
      </ui-menu>
      <output data-slot="output">Arrow keys stop at the ends. Type a status to jump to it.</output>
    </div>
  `
  const group = root.querySelector("ui-menu-radio-group")!
  group.addEventListener("valuechange", (event) => {
    const { value } = (event as CustomEvent<{ value: string }>).detail
    const next = statuses.find((option) => option.value === value)!
    group.setAttribute("value", value)
    root.querySelector("[data-label]")!.textContent = next.label
    current = next
  })
}

export { mount }
