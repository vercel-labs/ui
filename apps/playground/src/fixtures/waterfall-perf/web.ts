import "@ui-sdk/web/waterfall"
import type { UiWaterfallElement } from "@ui-sdk/web/waterfall"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"
import { flatWaterfall, longTrace } from "tests/fixtures/waterfall.ts"

// A trace of N requests of two spans each, every row rendered, for the count
// gates. Every request starts collapsed, so its spans render hidden.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const trace = longTrace(perfSize(200))
    const rows = flatWaterfall(trace)
      .map(
        (span) => `
          <ui-waterfall-row value="${span.value}">
            <ui-waterfall-row-header>${
              span.children
                ? "<ui-waterfall-indicator></ui-waterfall-indicator>"
                : ""
            }${span.label}</ui-waterfall-row-header>
            <ui-waterfall-cell>${span.status}</ui-waterfall-cell>
            <ui-waterfall-bar></ui-waterfall-bar>
          </ui-waterfall-row>`
      )
      .join("")
    target.innerHTML = `
      <div class="fixture">
        <button>Before</button>
        <ui-waterfall aria-label="Long trace">${rows}</ui-waterfall>
        <button>After</button>
      </div>
    `
    target.querySelector<UiWaterfallElement>("ui-waterfall")!.items = trace
  })
}

export { mount }
