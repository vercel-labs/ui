import "@ui-sdk/web/dialog"

let count = 0

function mount(root: HTMLElement) {
  const id = `dialog-chat-${++count}`
  root.innerHTML = `
    <ui-dialog persistent-elements="#${id}">
      <ui-dialog-trigger><button>Upgrade plan</button></ui-dialog-trigger>
      <ui-dialog-backdrop></ui-dialog-backdrop>
      <ui-dialog-content>
        <div data-slot="stack">
          <ui-dialog-title>Upgrade to Pro</ui-dialog-title>
          <ui-dialog-description>Questions? The chat in the corner still works.</ui-dialog-description>
        </div>
        <div data-slot="row">
          <ui-dialog-close><button>Not now</button></ui-dialog-close>
          <ui-dialog-close value="upgrade"><button data-variant="solid">Upgrade</button></ui-dialog-close>
        </div>
      </ui-dialog-content>
    </ui-dialog>
    <button data-variant="solid" id="${id}" type="button" popover="manual">Chat with us</button>
  `
  const chat = root.querySelector<HTMLButtonElement>(`#${id}`)!
  let messages = 0
  chat.addEventListener("click", () => (chat.textContent = `Chat with us (${++messages})`))
  root.querySelector("ui-dialog")!.addEventListener("openchange", (event) => {
    if (event.detail.value) requestAnimationFrame(() => chat.showPopover())
    else chat.hidePopover()
  })
}

export { mount }
