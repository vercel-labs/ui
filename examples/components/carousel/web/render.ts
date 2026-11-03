import "@ui-sdk/web/carousel"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

const photos = [
  { name: "Dunes" },
  { name: "Forest" },
  { name: "Glacier" },
  { name: "Canyon" },
  { name: "Meadow" },
  { name: "Harbor" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-carousel aria-label="Photos">
      <ui-carousel-viewport>
        <ui-carousel-content>
          ${photos.map((photo, index) => `<ui-carousel-item><div data-slot="tile">${photo.name}<span data-slot="hint">${index + 1} / ${photos.length}<span> · showing</span></span></div></ui-carousel-item>`).join("")}
        </ui-carousel-content>
      </ui-carousel-viewport>
      <div data-slot="row">
        <ui-carousel-previous>
          <button data-variant="secondary">${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML} Previous</button>
        </ui-carousel-previous>
        <ui-carousel-next>
          <button data-variant="secondary">Next ${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}</button>
        </ui-carousel-next>
        <a data-variant="secondary" href="https://example.com/gallery">See all photos</a>
      </div>
    </ui-carousel>
  `
  const next = root.querySelector<HTMLElement>("ui-carousel-next button")!
  root.querySelector("ui-carousel")!.addEventListener("pagechange", () => {
    if (document.activeElement !== next) return
    requestAnimationFrame(() => {
      if (next.hasAttribute("data-disabled"))
        root.querySelector<HTMLElement>('a[href="https://example.com/gallery"]')!.focus()
    })
  })
}

export { mount }
