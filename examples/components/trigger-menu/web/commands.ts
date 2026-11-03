import "@ui-sdk/web/trigger-menu"

const commands = [
  {
    value: "model",
    label: "model",
    arguments: [
      { name: "model", hint: "<model>", required: true, items: ["opus", "sonnet", "haiku"] },
      { name: "effort", hint: "[effort]", items: ["low", "medium", "high"], allowCustomValue: false },
    ],
  },
  { value: "search", label: "search", arguments: [{ name: "query", hint: "<query>", required: true }] },
  { value: "clear", label: "clear" },
  { value: "send", label: "send", after: "submit" as const },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="stack">
      <ui-trigger-menu>
        <ui-trigger-menu-input>
          <textarea name="prompt" aria-label="Prompt" placeholder="Try /model or /search"></textarea>
        </ui-trigger-menu-input>
        <ui-trigger-menu-hint></ui-trigger-menu-hint>
        <ui-trigger-menu-content>
          <ui-trigger-menu-list></ui-trigger-menu-list>
        </ui-trigger-menu-content>
        <template>
          <ui-trigger-menu-item>
          </ui-trigger-menu-item>
        </template>
      </ui-trigger-menu>
      <p data-slot="hint">/send submits the form.</p>
    </form>
  `
  const menu = root.querySelector("ui-trigger-menu")!
  const last = root.querySelector("p")!
  menu.triggers = [{ char: "/", boundary: "start", type: "command", items: commands }]
  menu.addEventListener("select", (event) => {
    last.textContent = `/${event.detail.value} ${JSON.stringify(event.detail.arguments)}`
  })
  const form = root.querySelector("form")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    last.textContent = `Sent: ${new FormData(form).get("prompt")}`
  })
}

export { mount }
