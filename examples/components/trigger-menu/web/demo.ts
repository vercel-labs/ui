import "@ui-sdk/web/trigger-menu"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

function mount(root: HTMLElement) {
  const id = `mention-${crypto.randomUUID()}`
  root.innerHTML = `
    <ui-trigger-menu>
      <div data-slot="stack">
        <label for="${id}" data-slot="label">Message</label>
        <ui-trigger-menu-input>
          <textarea id="${id}" placeholder="Type @ to mention someone"></textarea>
        </ui-trigger-menu-input>
        <div data-slot="visually-hidden">
          <ui-trigger-menu-status></ui-trigger-menu-status>
        </div>
      </div>
      <ui-trigger-menu-content>
        <ui-trigger-menu-empty>No one found.</ui-trigger-menu-empty>
        <ui-trigger-menu-list></ui-trigger-menu-list>
      </ui-trigger-menu-content>
      <template>
        <ui-trigger-menu-item>
        </ui-trigger-menu-item>
      </template>
    </ui-trigger-menu>
  `
  const menu = root.querySelector("ui-trigger-menu")!
  menu.triggers = [{ char: "@", items: people }]
}

export { mount }
