import "@ui-sdk/web/carousel"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

const products = [1, 2, 3, 4, 5, 6, 7, 8]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-carousel aria-label="Products" slides-per-page="3">
      <ui-carousel-viewport>
        <ui-carousel-content>
          ${products.map((product) => `<ui-carousel-item><div data-slot="tile">${product}</div></ui-carousel-item>`).join("")}
        </ui-carousel-content>
      </ui-carousel-viewport>
      <div data-slot="row">
        <ui-carousel-previous>
          <button data-variant="secondary" aria-label="Previous page">${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML}</button>
        </ui-carousel-previous>
        <ui-carousel-indicator-group aria-label="Choose a page">
          ${products.map((product) => `<ui-carousel-indicator><button aria-label="Page ${product}"></button></ui-carousel-indicator>`).join("")}
        </ui-carousel-indicator-group>
        <ui-carousel-next>
          <button data-variant="secondary" aria-label="Next page">${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}</button>
        </ui-carousel-next>
      </div>
    </ui-carousel>
  `
}

export { mount }
