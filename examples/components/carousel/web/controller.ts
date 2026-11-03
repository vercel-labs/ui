import "@ui-sdk/web/carousel"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

const slides = [1, 2, 3, 4, 5]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="row">
        <span>Featured</span>
        <div data-slot="row">
          <ui-carousel-previous for="featured-carousel">
            <button data-variant="secondary" aria-label="Previous slide">${createElement(ChevronLeft, { "aria-hidden": "true" }).outerHTML}</button>
          </ui-carousel-previous>
          <ui-carousel-next for="featured-carousel">
            <button data-variant="secondary" aria-label="Next slide">${createElement(ChevronRight, { "aria-hidden": "true" }).outerHTML}</button>
          </ui-carousel-next>
        </div>
      </div>
      <ui-carousel id="featured-carousel" aria-label="Featured" drag="false">
        <ui-carousel-viewport>
          <ui-carousel-content>
            ${slides.map((slide) => `<ui-carousel-item><div data-slot="tile">${slide}</div></ui-carousel-item>`).join("")}
          </ui-carousel-content>
        </ui-carousel-viewport>
      </ui-carousel>
      <button data-variant="secondary" type="button" data-show-last>Show the last slide</button>
    </div>
  `
  const carousel = root.querySelector("ui-carousel")!
  root.querySelector("[data-show-last]")!.addEventListener("click", () => carousel.api.setPage(5))
}

export { mount }
