import "@ui-sdk/web/accordion"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"

// An accordion of N items, like a long FAQ.
// Every item starts closed. With ?found, closed panels stay in the page for
// find in page.
function mount(root: HTMLElement) {
  const found = new URLSearchParams(location.search).has("found")
  mountWhenAsked(root, (target) => {
    const items = Array.from(
      { length: perfSize(200) },
      (_, index) => `
        <ui-accordion-item class="accordion-item" value="item-${index}">
          <ui-accordion-header>
            <h3 class="accordion-header"><ui-accordion-trigger><button class="accordion-trigger">Question ${index + 1}</button></ui-accordion-trigger></h3>
          </ui-accordion-header>
          <ui-accordion-panel class="accordion-panel">Answer ${index + 1}</ui-accordion-panel>
        </ui-accordion-item>`
    ).join("")
    target.innerHTML = `
      <div class="fixture" style="flex-direction: column; align-items: start">
        <button>Before</button>
        <ui-accordion class="accordion"${found ? " hidden-until-found" : ""}>${items}</ui-accordion>
        <button>After</button>
      </div>
    `
  })
}

export { mount }
