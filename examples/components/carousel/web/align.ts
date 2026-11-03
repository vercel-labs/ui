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
    <ui-carousel aria-label="Photos" align="center">
      <ui-carousel-viewport>
        <ui-carousel-content>
          ${photos.map((photo) => `<ui-carousel-item><div data-slot="tile">${photo.name}</div></ui-carousel-item>`).join("")}
        </ui-carousel-content>
      </ui-carousel-viewport>
      <div data-slot="row">
        <ui-carousel-previous>
          <button data-variant="secondary" aria-label="Previous slide">${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML}</button>
        </ui-carousel-previous>
        <ui-carousel-next>
          <button data-variant="secondary" aria-label="Next slide">${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}</button>
        </ui-carousel-next>
      </div>
    </ui-carousel>
  `
}

export { mount }
