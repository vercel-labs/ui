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
    <ui-trigger-menu container="#positioning-box-web">
      <div data-slot="stack">
        <ui-trigger-menu-input>
          <textarea id="positioning-field-web" aria-label="Comment" placeholder="The list opens above, at the field's start"></textarea>
        </ui-trigger-menu-input>
        <div id="positioning-box-web"></div>
      </div>
      <ui-trigger-menu-content side="top" align="start" side-offset="8" align-offset="-4" collision-padding="16" anchor="#positioning-field-web" keep-mounted>
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
