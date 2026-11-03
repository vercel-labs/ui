import "@ui-sdk/web/drawer"
import type { UiDrawerElement } from "@ui-sdk/web/drawer"

type SharedDocument = { name: string; size: string; uploading?: boolean }

const documents: SharedDocument[] = [
  { name: "Budget.xlsx", size: "48 KB" },
  { name: "Roadmap.pdf", size: "1.2 MB" },
  { name: "Launch video.mp4", size: "310 MB", uploading: true },
]

let count = 0

function mount(root: HTMLElement) {
  const id = `drawer-share-${++count}`
  root.innerHTML = `
    <div data-slot="stack">
      <ul data-slot="list"></ul>
      <div data-slot="row">
        <button data-variant="solid" type="button" data-code>Share the roadmap</button>
        <span data-slot="hint" role="status"></span>
      </div>
      <ui-drawer id="${id}">
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content>
          <div data-slot="grip" aria-hidden="true"></div>
          <div data-slot="stack">
            <ui-drawer-title></ui-drawer-title>
            <ui-drawer-description>Anyone with the link can view it.</ui-drawer-description>
          </div>
          <div data-slot="stack">
            <ui-drawer-close value="copy"><button data-variant="solid">Copy link</button></ui-drawer-close>
            <ui-drawer-close value="email"><button>Send by email</button></ui-drawer-close>
          </div>
        </ui-drawer-content>
      </ui-drawer>
    </div>
  `
  const list = root.querySelector("ul")!
  const drawer = root.querySelector<UiDrawerElement<SharedDocument>>("ui-drawer")!
  const title = root.querySelector("ui-drawer-title")!
  const status = root.querySelector('[role="status"]')!
  for (const file of documents) {
    const row = document.createElement("li")
    row.dataset.slot = "row"
    row.innerHTML = `<span data-slot="row">${file.name}<span data-slot="hint">${file.uploading ? "Uploading…" : file.size}</span></span>`
    const trigger = Object.assign(document.createElement("ui-drawer-trigger"), { payload: file })
    trigger.setAttribute("for", id)
    if (file.uploading) trigger.setAttribute("disabled", "")
    trigger.innerHTML = `<button aria-label="Share ${file.name}">Share</button>`
    row.append(trigger)
    list.append(row)
  }
  drawer.addEventListener("openchange", (event) => {
    const { value, returnValue } = event.detail
    if (!value) {
      if (returnValue) status.textContent = `Shared: ${returnValue}`
      return
    }
    title.textContent = `Share ${drawer.api.getPayload()?.name}`
  })
  root.querySelector("[data-code]")!.addEventListener("click", async () => {
    const { reason, returnValue } = await drawer.api.open({ payload: documents[1] })
    status.textContent = returnValue ? `Shared from code: ${returnValue}` : `Closed with ${reason}`
  })
}

export { mount }
