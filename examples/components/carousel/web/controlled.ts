import "@ui-sdk/web/carousel"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

const slides = [1, 2, 3, 4, 5]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-carousel aria-label="Featured">
      <ui-carousel-viewport>
        <ui-carousel-content>
          ${slides.map((slide) => `<ui-carousel-item><div data-slot="tile">${slide}</div></ui-carousel-item>`).join("")}
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
      <p data-slot="hint"></p>
    </ui-carousel>
  `
  const carousel = root.querySelector("ui-carousel")!
  const output = root.querySelector("p")!
  const show = (reason = "") => {
    const count = carousel.api.getPageCount() ?? slides.length
    output.textContent = `Slide ${carousel.page} of ${count}${reason && ` · ${reason}`}`
  }
  carousel.addEventListener("pagechange", (event) => queueMicrotask(() => show(event.detail.reason)))
  show()
}

export { mount }
