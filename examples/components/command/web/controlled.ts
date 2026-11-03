import "@ui-sdk/web/command"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-command default-value="dark" default-pages="theme">
        <ui-command-input>
          <input aria-label="Search themes" placeholder="Search themes..." />
        </ui-command-input>
        <ui-command-list>
          <ui-command-page>
            <ui-command-item value="theme" page="theme">Change theme…</ui-command-item>
          </ui-command-page>
          <ui-command-page value="theme">
            ${themes
              .map((theme) => `<ui-command-item value="${theme.value}">${theme.label}</ui-command-item>`)
              .join("")}
          </ui-command-page>
        </ui-command-list>
      </ui-command>
      <output data-slot="output"></output>
      <ui-command default-value="system" default-query="s" default-pages="" debug>
        <ui-command-input>
          <input aria-label="Search themes, uncontrolled" />
        </ui-command-input>
        <ui-command-list>
          ${themes
            .map((theme) => `<ui-command-item value="${theme.value}">${theme.label}</ui-command-item>`)
            .join("")}
        </ui-command-list>
      </ui-command>
    </div>
  `
  const command = root.querySelector("ui-command")!
  const output = root.querySelector("output")!
  let value: string | null = "dark"
  let query = ""
  let pages = ["theme"]
  let reason = ""
  const write = () =>
    (output.textContent = `Highlighted ${value ?? "nothing"} (${reason || "start"}), text “${query}”, pages [${pages.join(", ")}]`)
  write()
  command.addEventListener("valuechange", (event) => {
    const detail = (event as CustomEvent<{ value: string | null; reason: string }>).detail
    value = detail.value
    reason = detail.reason
    write()
  })
  command.addEventListener("querychange", (event) => {
    query = (event as CustomEvent<{ value: string }>).detail.value
    write()
  })
  command.addEventListener("pageschange", (event) => {
    pages = (event as CustomEvent<{ value: string[] }>).detail.value
    write()
  })
}
