import { carouselFixture, carouselOptions } from "tests/fixtures/carousel.ts"

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

const attribute = (name: string) =>
  name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)

function markup(playToggle: boolean) {
  const slides = carouselFixture.slides
    .map(
      (slide, index) =>
        `<ui-carousel-item class="carousel-slide"><p>${escape(slide.title)}</p><a href="?product=${index + 1}">${escape(slide.link)}</a>${
          index === 2
            ? `<label> ${escape(carouselFixture.field)} <input></label>`
            : ""
        }</ui-carousel-item>`
    )
    .join("")
  const indicators = carouselFixture.slides
    .map(
      (_, index) =>
        `<ui-carousel-indicator><button class="carousel-indicator" aria-label="${carouselFixture.indicator(index + 1)}">${index + 1}</button></ui-carousel-indicator>`
    )
    .join("")
  // The toggle's label switches with CSS on the button's `data-playing`.
  const toggle = playToggle
    ? `<ui-carousel-play-toggle><button class="carousel-toggle"><span class="when-playing">${carouselFixture.stop}</span><span class="when-stopped">${carouselFixture.start}</span></button></ui-carousel-play-toggle>`
    : ""
  return `
    <style>
      .carousel-toggle[data-playing] .when-stopped,
      .carousel-toggle:not([data-playing]) .when-playing { display: none; }
    </style>
    <div class="fixture">
      <button>Before</button>
      <ui-carousel id="carousel" class="carousel" aria-label="${carouselFixture.label}">
        ${toggle}
        <ui-carousel-viewport class="carousel-viewport">
          <ui-carousel-content class="carousel-content">${slides}</ui-carousel-content>
        </ui-carousel-viewport>
        <div class="carousel-controls">
          <ui-carousel-previous><button class="carousel-step">${carouselFixture.previous}</button></ui-carousel-previous>
          <ui-carousel-next><button class="carousel-step">${carouselFixture.next}</button></ui-carousel-next>
        </div>
        <ui-carousel-indicator-group class="carousel-controls" aria-label="${carouselFixture.indicators}">${indicators}</ui-carousel-indicator-group>
      </ui-carousel>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Last reason"></output>
      <output aria-label="Rested on"></output>
      <button id="controller">Show page 4</button>
      <ui-carousel-next for="carousel"><button>Next from outside</button></ui-carousel-next>
    </div>
  `
}

async function mount(root: HTMLElement) {
  const { perView, cancel, playToggle, options } = carouselOptions()
  root.innerHTML = markup(playToggle)
  const carousel = root.querySelector<
    HTMLElement & { api?: { setPage: (page: number) => void } }
  >("ui-carousel")!
  carousel.style.setProperty("--per-view", String(perView))
  for (const [name, value] of Object.entries(options)) {
    carousel.setAttribute(attribute(name), value === true ? "" : String(value))
  }
  await import("@ui-sdk/web/carousel")
  root
    .querySelector("#controller")!
    .addEventListener("click", () => carousel.api?.setPage(4))
  root.addEventListener(
    "pagechange",
    (event) => {
      const detail = (event as CustomEvent<{ value: number; reason: string }>)
        .detail
      if (detail.value === cancel) {
        return event.preventDefault()
      }
      const [action, reason] = root.querySelectorAll("output")
      action.textContent = String(detail.value)
      reason.textContent = detail.reason
    },
    { capture: true }
  )
  root.addEventListener(
    "pagechangecomplete",
    (event) => {
      root.querySelector("output[aria-label='Rested on']")!.textContent =
        String((event as CustomEvent<{ value: number }>).detail.value)
    },
    { capture: true }
  )
}

export { mount }
