import "@ui-sdk/web/popover"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-popover>
      <ui-popover-trigger><button>Animated</button></ui-popover-trigger>
      <ui-popover-content keep-mounted>
        <ui-popover-title>Scale and fade</ui-popover-title>
        <ui-popover-description>300ms in and out, from the trigger.</ui-popover-description>
      </ui-popover-content>
    </ui-popover>
    <output data-slot="output">Closed</output>
  `
  const popover = root.querySelector("ui-popover")!
  const status = root.querySelector("output")!
  popover.addEventListener("openchange", (event) => {
    status.textContent = event.detail.value ? "Opening" : "Closing"
  })
  popover.addEventListener("openchangecomplete", (event) => {
    status.textContent = event.detail.value ? "Open" : "Closed"
  })
}

export { mount }
