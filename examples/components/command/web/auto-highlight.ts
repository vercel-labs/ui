import "@ui-sdk/web/command"

const commands = ["Home", "Inbox", "Documents", "Downloads", "Pictures", "Music", "New file", "New folder"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-command auto-highlight="false" loop="false">
      <ui-command-input>
        <input aria-label="Search commands" placeholder="Type, then press ArrowDown" />
      </ui-command-input>
      <ui-command-list>
        ${commands.map((label) => `<ui-command-item value="${label}">${label}</ui-command-item>`).join("")}
      </ui-command-list>
    </ui-command>
  `
}

export { mount }
