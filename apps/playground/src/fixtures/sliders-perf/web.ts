import "@ui-sdk/web/slider"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"

// N single-thumb sliders, like a page of settings. Each submits a value.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const sliders = Array.from(
      { length: perfSize(200) },
      (_, index) => `
        <ui-slider class="slider-row" name="slider-${index}" default-value="${index % 101}">
          <ui-slider-control class="slider-control">
            <ui-slider-track class="slider-track">
              <ui-slider-indicator class="slider-indicator"></ui-slider-indicator>
              <ui-slider-thumb class="slider-thumb" aria-label="Slider ${index + 1}"></ui-slider-thumb>
            </ui-slider-track>
          </ui-slider-control>
        </ui-slider>`,
    ).join("")
    target.innerHTML = `
      <div class="fixture" style="flex-direction: column; align-items: start">
        <button>Before</button>
        ${sliders}
        <button>After</button>
      </div>
    `
  })
}

export { mount }
