import "@ui-sdk/web/drawer"

let count = 0

function mount(root: HTMLElement) {
  const id = `drawer-chat-${++count}`
  root.innerHTML = `
    <ui-drawer persistent-elements="#${id}">
      <ui-drawer-trigger><button>Upgrade plan</button></ui-drawer-trigger>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <ui-drawer-title>Upgrade to Pro</ui-drawer-title>
          <ui-drawer-description>Questions? The chat in the corner still works.</ui-drawer-description>
        </div>
        <div data-slot="stack">
          <ui-drawer-close value="upgrade"><button data-variant="solid">Upgrade</button></ui-drawer-close>
          <ui-drawer-close><button>Not now</button></ui-drawer-close>
        </div>
      </ui-drawer-content>
    </ui-drawer>
    <button data-variant="solid" id="${id}" type="button" popover="manual">Chat with us</button>
  `
  const chat = root.querySelector<HTMLButtonElement>(`#${id}`)!
  let messages = 0
  chat.addEventListener("click", () => (chat.textContent = `Chat with us (${++messages})`))
  root.querySelector("ui-drawer")!.addEventListener("openchange", (event) => {
    if (event.detail.value) requestAnimationFrame(() => chat.showPopover())
    else chat.hidePopover()
  })
}

export { mount }
