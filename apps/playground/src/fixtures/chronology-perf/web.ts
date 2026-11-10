import "@ui-sdk/web/chronology"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A chronology with many events, each with every part, for the counts specs.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const events = perfItems(perfSize())
      .map(
        (item) => `
          <ui-chronology-item>
            <ui-chronology-marker></ui-chronology-marker>
            <ui-chronology-connector></ui-chronology-connector>
            <ui-chronology-title>${item.label}</ui-chronology-title>
            <ui-chronology-time><time datetime="2026-11-10">Nov 10</time></ui-chronology-time>
            <ui-chronology-description>Something happened.</ui-chronology-description>
          </ui-chronology-item>`
      )
      .join("")
    target.innerHTML = `
      <div class="fixture">
        <button>Before</button>
        <ui-chronology aria-label="Activity">${events}</ui-chronology>
        <button>After</button>
      </div>
    `
  })
}

export { mount }
