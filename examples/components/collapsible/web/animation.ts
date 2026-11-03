import "@ui-sdk/web/collapsible"
import { ChevronDown, createElement } from "lucide"

const notes = [
  "Search now matches file contents, not only names.",
  "Shared links remember the folder they were opened from.",
  "Uploads resume after the connection drops.",
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div>
      <ui-collapsible>
        <ui-collapsible-trigger>
          <button data-variant="secondary">
            Release notes
            ${createElement(ChevronDown, { "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-collapsible-trigger>
        <ui-collapsible-panel>
          <ul>
            ${notes.map((note) => `<li>${note}</li>`).join("")}
          </ul>
        </ui-collapsible-panel>
      </ui-collapsible>
      <output data-slot="output">Not animated yet</output>
    </div>
  `
  root.querySelector("ui-collapsible")!.addEventListener("openchangecomplete", (event) => {
    const open = (event as CustomEvent<{ value: boolean }>).detail.value
    root.querySelector("output")!.textContent = `Finished ${open ? "opening" : "closing"}`
  })
}

export { mount }
