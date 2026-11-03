import "@ui-sdk/web/tooltip"

const items = ["Inbox", "Drafts", "Sent"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        ${items
          .map(
            (item) => `
        <ui-tooltip data-item="${item}">
          <ui-tooltip-trigger><button>${item}</button></ui-tooltip-trigger>
          <ui-tooltip-content>Open ${item.toLowerCase()}</ui-tooltip-content>
        </ui-tooltip>`,
          )
          .join("")}
      </div>
      <output data-slot="output">Closed</output>
    </div>
  `
  const status = root.querySelector("output")!
  const item = (event: Event) => (event.target as HTMLElement).dataset.item
  const open = (event: Event) => (event as CustomEvent<{ value: boolean }>).detail.value
  root.addEventListener(
    "openchange",
    (event) => {
      status.textContent = `${item(event)} ${open(event) ? "opening" : "closing"}`
    },
    { capture: true },
  )
  root.addEventListener(
    "openchangecomplete",
    (event) => {
      if (!open(event) && status.textContent !== `${item(event)} closing`) return
      status.textContent = `${item(event)} ${open(event) ? "open" : "closed"}`
    },
    { capture: true },
  )
}

export { mount }
