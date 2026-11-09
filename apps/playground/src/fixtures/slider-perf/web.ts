import { perfSize, perfThumbs } from "tests/fixtures/perf.ts"

// A slider with N thumbs for the counts specs. Web components
// have no renders to count.
async function mount(root: HTMLElement) {
  const values = perfThumbs(perfSize())
  const thumbs = values
    .map(
      (_, index) =>
        `<ui-slider-thumb class="slider-thumb" aria-label="Thumb ${index + 1}"></ui-slider-thumb>`
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-slider default-value="${values.join("/")}" max="1000">
        <ui-slider-control class="slider-control is-wide">
          <ui-slider-track class="slider-track">
            <ui-slider-indicator class="slider-indicator"></ui-slider-indicator>
            ${thumbs}
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
      <button>After</button>
    </div>
  `
  await import("@ui-sdk/web/slider")
}

export { mount }
