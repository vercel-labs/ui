import "@ui-sdk/web/toolbar"
import "@ui-sdk/web/select"
import { Check, ChevronsUpDown, createElement, Monitor, ZoomIn, ZoomOut } from "lucide"

const zooms = ["50%", "75%", "100%", "150%", "200%"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toolbar aria-label="View">
      <ui-toolbar-button data-zoom="out">
        <button data-variant="secondary" aria-label="Zoom out">
          ${createElement(ZoomOut, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-toolbar-button>
      <ui-select default-value="100%">
        <ui-toolbar-button>
          <ui-select-trigger>
            <button data-variant="secondary" aria-label="Zoom">
              <ui-select-value></ui-select-value>
              ${createElement(ChevronsUpDown, { "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-select-trigger>
        </ui-toolbar-button>
        <ui-select-content>
          ${zooms
            .map(
              (zoom) => `
                <ui-select-item value="${zoom}">
                  ${zoom}
                  <ui-select-item-indicator>${createElement(Check, { "aria-hidden": "true" }).outerHTML}</ui-select-item-indicator>
                </ui-select-item>
              `,
            )
            .join("")}
        </ui-select-content>
      </ui-select>
      <ui-toolbar-button data-zoom="in">
        <button data-variant="secondary" aria-label="Zoom in">
          ${createElement(ZoomIn, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-toolbar-button>
      <ui-toolbar-separator></ui-toolbar-separator>
      <ui-toolbar-button data-zoom="fit">
        <button data-variant="secondary" aria-label="Fit to screen">
          ${createElement(Monitor, { "aria-hidden": "true" }).outerHTML}
        </button>
      </ui-toolbar-button>
    </ui-toolbar>
  `
  const select = root.querySelector("ui-select") as HTMLElement & { value: string | null }
  const button = (zoom: string) => root.querySelector(`[data-zoom="${zoom}"]`)!
  const show = () => {
    const index = zooms.indexOf(select.value ?? "")
    button("out").toggleAttribute("disabled", index === 0)
    button("in").toggleAttribute("disabled", index === zooms.length - 1)
  }
  const step = (by: number) => {
    const index = zooms.indexOf(select.value ?? "")
    select.value = zooms[Math.min(Math.max(index + by, 0), zooms.length - 1)]
  }
  button("out").addEventListener("click", () => step(-1))
  button("in").addEventListener("click", () => step(1))
  button("fit").addEventListener("click", () => (select.value = "100%"))
  select.addEventListener("valuechange", () => queueMicrotask(show))
  customElements.whenDefined("ui-select").then(show)
}

export { mount }
