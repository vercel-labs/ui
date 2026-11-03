import "@ui-sdk/web/popover"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <ui-popover>
          <ui-popover-trigger><button>Share</button></ui-popover-trigger>
          <ui-popover-content>
            <ui-popover-title>Share this file</ui-popover-title>
            <ui-popover-description>Anyone with the link can view it.</ui-popover-description>
            <ui-popover-close><button>Done</button></ui-popover-close>
          </ui-popover-content>
        </ui-popover>
        <button type="button" data-open-elsewhere data-variant="ghost">Open from elsewhere</button>
      </div>

      <output data-slot="output">Closed</output>
    </div>
  `
  const popover = root.querySelector("ui-popover")!
  root.querySelector("[data-open-elsewhere]")!.addEventListener("click", () => popover.api.open())

  popover.addEventListener("openchange", (event) => {
    const { value, reason } = event.detail
    root.querySelector("output")!.textContent = `${value ? "Open" : "Closed"}, last change: ${reason}`
  })
}

export { mount }
