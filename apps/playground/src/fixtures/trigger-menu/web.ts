import {
  fixtureTriggers,
  selectAction,
  triggerMenuFixture as f,
  triggerMenuOptions,
} from "tests/fixtures/trigger-menu.ts"

function composer(name: string, id: string, { input, empty }: { input: boolean; empty: boolean }) {
  const field = input
    ? `<input id="${id}" name="message" class="input" />`
    : `<textarea id="${id}" name="message" class="input"></textarea>`
  return `
    <ui-trigger-menu>
      <label class="label" for="${id}">${name}</label>
      <ui-trigger-menu-input>${field}</ui-trigger-menu-input>
      <ui-trigger-menu-hint class="hint"></ui-trigger-menu-hint>
      <ui-trigger-menu-status class="status"></ui-trigger-menu-status>
      <ui-trigger-menu-content class="popup list-popup">
        ${empty ? `<ui-trigger-menu-empty class="empty">${f.empty}</ui-trigger-menu-empty>` : ""}
        <ui-trigger-menu-list></ui-trigger-menu-list>
      </ui-trigger-menu-content>
      <template>
        <ui-trigger-menu-item class="item"></ui-trigger-menu-item>
      </template>
    </ui-trigger-menu>`
}

async function mount(root: HTMLElement) {
  await import("@ui-sdk/web/trigger-menu")
  const options = triggerMenuOptions()
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form class="composer" aria-label="${f.formLabel}">
        ${composer(f.label, "message", options)}
        ${options.twice ? composer("Second", "second", options) : ""}
        <button type="submit">${f.submit}</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Open"></output>
      <output role="status" aria-label="Submitted"></output>
    </div>`
  const output = (name: string) => root.querySelector<HTMLOutputElement>(`output[aria-label="${name}"]`)!
  for (const menu of root.querySelectorAll("ui-trigger-menu")) {
    menu.triggers = fixtureTriggers()
    if (!options.autoHighlight) menu.setAttribute("auto-highlight", "false")
    menu.addEventListener("openchange", (event) => {
      output("Open").textContent = `${event.detail.value}:${event.detail.reason}`
    })
    menu.addEventListener("itemselect", (event) => {
      output("Last action").textContent = selectAction(event.detail.value, event.detail.arguments)
    })
  }
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    output("Submitted").textContent = String(new FormData(form).get("message"))
  })
}

export { mount }
