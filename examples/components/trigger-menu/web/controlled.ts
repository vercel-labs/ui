import "@ui-sdk/web/trigger-menu"

const people = [
  { value: "ada", label: "Ada Lovelace", keywords: ["ada"] },
  { value: "alan", label: "Alan Turing" },
  { value: "grace", label: "Grace Hopper" },
  { value: "katherine", label: "Katherine Johnson" },
  { value: "linus", label: "Linus Torvalds", disabled: true },
  { value: "margaret", label: "Margaret Hamilton" },
]

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
    <ui-trigger-menu auto-highlight="false" loop="false" shortcut="ctrl+j" status="idle">
      <div data-slot="stack">
        <ui-trigger-menu-input>
          <textarea aria-label="Message" placeholder="Type @ or /"></textarea>
        </ui-trigger-menu-input>
        <ul data-slot="output"></ul>
      </div>
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
  const list = root.querySelector("ul")!
  const note = (line: string) => {
    const item = document.createElement("li")
    item.textContent = line
    list.prepend(item)
    while (list.children.length > 4) {
      list.lastElementChild!.remove()
    }
  }
  menu.triggers = [
    { char: "@", items: people },
    { char: "/", boundary: "start", items: commands },
  ]
  menu.addEventListener("openchange", (event) => {
    const { value, reason, trigger } = event.detail as typeof event.detail & { trigger: string | null }
    note(`${value ? "opened" : "closed"} ${trigger ?? ""} (${reason})`)
  })
  menu.addEventListener("openchangecomplete", (event) =>
    note(event.detail.value ? "finished opening" : "finished closing"),
  )
  menu.addEventListener("querychange", (event) =>
    note(`query “${event.detail.value}”${event.detail.argument ? ` for ${event.detail.argument}` : ""}`),
  )
}

export { mount }
