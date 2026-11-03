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
  root.innerHTML = `
    <ui-trigger-menu>
      <ui-trigger-menu-input>
        <input aria-label="Assign to" placeholder="Assign with @" />
      </ui-trigger-menu-input>
      <ui-trigger-menu-content>
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
