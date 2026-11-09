const slides = ["One", "Two", "Three"]

async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-carousel class="carousel" aria-label="Photos">
        <ui-carousel-viewport class="carousel-viewport">
          <ui-carousel-content>
            ${slides.map((slide) => `<ui-carousel-item class="carousel-slide">${slide}</ui-carousel-item>`).join("")}
          </ui-carousel-content>
        </ui-carousel-viewport>
        <ui-carousel-next><button>Next photo</button></ui-carousel-next>
        <ui-carousel-indicator-group aria-label="Choose a photo">
          ${slides
            .map(
              (_, index) =>
                `<ui-carousel-indicator><a href="#photo-${index + 1}" aria-label="Photo ${index + 1}">${index + 1}</a></ui-carousel-indicator>`
            )
            .join("")}
        </ui-carousel-indicator-group>
      </ui-carousel>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/carousel")
  root.addEventListener(
    "pagechange",
    (event) => {
      root.querySelector("output")!.textContent = String(
        (event as CustomEvent<{ value: number }>).detail.value
      )
    },
    { capture: true }
  )
}

export { mount }
