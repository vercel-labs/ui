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
    <div data-slot="stack">
      <ui-trigger-menu>
        <ui-trigger-menu-input>
          <textarea aria-label="Message"></textarea>
        </ui-trigger-menu-input>
        <ui-trigger-menu-content>
          <ui-trigger-menu-list></ui-trigger-menu-list>
        </ui-trigger-menu-content>
        <template>
          <ui-trigger-menu-item>
          </ui-trigger-menu-item>
        </template>
      </ui-trigger-menu>
      <div data-slot="row">
        <button type="button" value="mention" data-variant="secondary">Mention</button>
        <button type="button" value="date" data-variant="secondary">Insert date</button>
        <button type="button" value="toggle" data-variant="secondary">Toggle</button>
      </div>
      <p data-slot="hint"></p>
    </div>
  `
  const menu = root.querySelector("ui-trigger-menu")!
  const result = root.querySelector("p")!
  menu.triggers = [{ char: "@", items: people }]
  for (const button of root.querySelectorAll("button")) {
    button.addEventListener("mousedown", (event) => event.preventDefault())
    button.addEventListener("click", async () => {
      if (button.value === "mention") {
        const closed = await menu.api.open({ trigger: "@" })
        result.textContent = `Closed with ${closed.reason}`
      } else if (button.value === "date") {
        const match = menu.api.getMatch()
        result.textContent = match
          ? `Query “${menu.api.getQuery()}” at ${match.start}`
          : `Open: ${menu.api.isOpen()}`
        menu.api.insert(new Date().toLocaleDateString())
      } else if (menu.api.isOpen()) {
        menu.api.close()
      } else {
        menu.api.setOpen(true)
      }
    })
  }
}

export { mount }
