import "@ui-sdk/web/drawer"

const messages = [
  { from: "Inès", text: "The proofs are back from the printer." },
  { from: "Kofi", text: "Lunch on Thursday?" },
  { from: "Wren", text: "Pushed the fix for the release build." },
  { from: "Tomasz", text: "Can you review the launch checklist?" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-drawer>
      <div>
        <ui-drawer-outlet>
          <div data-slot="row">
            <span>Inbox</span>
            <ui-drawer-trigger><button data-variant="solid">Compose</button></ui-drawer-trigger>
          </div>
          <ul data-slot="list">
            ${messages
              .map(
                (message) => `<li>
                  <div>${message.from}</div>
                  <div data-slot="hint">${message.text}</div>
                </li>`,
              )
              .join("")}
          </ul>
        </ui-drawer-outlet>
      </div>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <ui-drawer-title>New message</ui-drawer-title>
          <ui-drawer-description>Drag it down slowly and watch the inbox follow.</ui-drawer-description>
        </div>
        <div data-slot="stack">
          <input aria-label="To" placeholder="To" />
          <textarea aria-label="Message" placeholder="Message"></textarea>
        </div>
        <div data-slot="stack">
          <ui-drawer-close value="send"><button data-variant="solid">Send</button></ui-drawer-close>
        </div>
      </ui-drawer-content>
    </ui-drawer>
  `
  const outlet = root.querySelector("ui-drawer-outlet")!
  outlet.keyframes = { scale: [1, 0.94], borderRadius: ["0px", "24px"] }
}

export { mount }
