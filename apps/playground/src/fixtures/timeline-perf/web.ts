import "@ui-sdk/web/timeline"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A timeline with many events, each with every part, for the counts specs.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const events = perfItems(perfSize())
      .map(
        (item) => `
          <ui-timeline-item>
            <ui-timeline-marker></ui-timeline-marker>
            <ui-timeline-connector></ui-timeline-connector>
            <ui-timeline-title>${item.label}</ui-timeline-title>
            <ui-timeline-time><time datetime="2026-11-10">Nov 10</time></ui-timeline-time>
            <ui-timeline-description>Something happened.</ui-timeline-description>
          </ui-timeline-item>`
      )
      .join("")
    target.innerHTML = `
      <div class="fixture">
        <button>Before</button>
        <ui-timeline aria-label="Activity">${events}</ui-timeline>
        <button>After</button>
      </div>
    `
  })
}

export { mount }
