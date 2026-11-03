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

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-command>
      <ui-command-input>
        <input aria-label="Search commands" placeholder="Search..." />
      </ui-command-input>
      <ui-command-empty>No results found.</ui-command-empty>
      <ui-command-list>
        ${commands.map((label) => `<ui-command-item value="${label}">${label}</ui-command-item>`).join("")}
      </ui-command-list>
    </ui-command>
  `
}

export { mount }
