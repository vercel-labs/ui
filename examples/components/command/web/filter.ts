import "@ui-sdk/web/command"

const commands = [
  "Home",
  "Inbox",
  "Documents",
  "Downloads",
  "Pictures",
  "Music",
  "New file",
  "New folder",
  "Copy",
  "Cut",
  "Paste",
  "Delete",
  "Zoom in",
  "Zoom out",
  "Notifications",
  "Help",
  "Keyboard shortcuts",
  "Settings",
]

const filters = ["fuzzy", "contains", "startsWith", "words"] as const

function words(item: { label: string }, query: string) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) =>
      item.label
        .toLowerCase()
        .split(" ")
        .some((part) => part.startsWith(word)),
    )
}

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        ${filters
          .map(
            (name) =>
              `<button type="button" data-filter="${name}" aria-pressed="${name === "fuzzy"}">${name}</button>`,
          )
          .join("")}
      </div>
      <ui-command>
        <ui-command-input>
          <input aria-label="Search commands" placeholder="Try “nf” or “zo in”" />
        </ui-command-input>
        <ui-command-empty>No results found.</ui-command-empty>
        <ui-command-list>
          ${commands.map((label) => `<ui-command-item value="${label}">${label}</ui-command-item>`).join("")}
        </ui-command-list>
      </ui-command>
    </div>
  `
  const command = root.querySelector("ui-command") as HTMLElement & { filter?: unknown }
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-filter]")
  for (const button of buttons)
    button.addEventListener("click", () => {
      const mode = button.dataset.filter!
      command.filter = mode === "words" ? words : mode
      for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
    })
}

export { mount }
