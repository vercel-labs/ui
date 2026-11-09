import "@ui-sdk/web/tooltip"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"

// N tooltip triggers in a row, like a toolbar of icon buttons, for the counts
// specs. Keyboard focus opens a tooltip at once, so Tab shows
// each in turn. Web components have no renders to count.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const tips = Array.from(
      { length: perfSize() },
      (_, index) => `
        <div class="tooltip-row">
          <ui-tooltip delay="0">
            <ui-tooltip-trigger><button class="tooltip-trigger">Tip ${index + 1}</button></ui-tooltip-trigger>
            <ui-tooltip-content class="tooltip">Hint ${index + 1}</ui-tooltip-content>
          </ui-tooltip>
        </div>`
    ).join("")
    target.innerHTML = `
      <div class="fixture tooltip-page" style="flex-wrap: wrap">
        <button>Before</button>
        ${tips}
        <button>After</button>
      </div>
    `
  })
}

export { mount }
