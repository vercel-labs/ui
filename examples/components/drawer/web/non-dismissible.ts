import "@ui-sdk/web/drawer"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-drawer dismissible="false">
      <ui-drawer-trigger><button>Write a post</button></ui-drawer-trigger>
      <ui-drawer-backdrop></ui-drawer-backdrop>
      <ui-drawer-content>
        <div data-slot="grip" aria-hidden="true"></div>
        <div data-slot="stack">
          <ui-drawer-title>New post</ui-drawer-title>
          <ui-drawer-description>Try to swipe it away, press outside it or press Escape.</ui-drawer-description>
        </div>
        
          <textarea aria-label="Post">Shipped the new drawer today. It feels just like the system sheet.</textarea>
        
        <div data-slot="row" role="alert" hidden>
          <span>
            You have unsaved changes.
            <span data-slot="hint" data-reason></span>
          </span>
          <ui-drawer-close><button>Discard</button></ui-drawer-close>
        </div>
        
        <div data-slot="stack">
          <ui-drawer-close value="post"><button data-variant="solid">Post</button></ui-drawer-close>
        </div>
      </ui-drawer-content>
    </ui-drawer>
  `
  const drawer = root.querySelector("ui-drawer")!
  const alert = root.querySelector<HTMLElement>('[role="alert"]')!
  const reason = root.querySelector("[data-reason]")!
  drawer.addEventListener("dismissattempt", (event) => {
    reason.textContent = `Refused: ${event.detail.reason}`
    alert.hidden = false
  })
  drawer.addEventListener("openchange", (event) => {
    if (event.detail.value) alert.hidden = true
  })
}

export { mount }
