import { describeValue } from "tests/fixtures/accordion.ts"

async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-accordion class="accordion" default-value="overview">
        <ui-accordion-item class="accordion-item" value="overview">
          <ui-accordion-header>
            <h2 class="accordion-header"><ui-accordion-trigger><button class="accordion-trigger">Overview</button></ui-accordion-trigger></h2>
          </ui-accordion-header>
          <ui-accordion-panel as-child><section class="accordion-panel">The overview panel.</section></ui-accordion-panel>
        </ui-accordion-item>
        <ui-accordion-item class="accordion-item" value="details">
          <ui-accordion-header class="accordion-header">
            <ui-accordion-trigger><div class="accordion-trigger">Details</div></ui-accordion-trigger>
          </ui-accordion-header>
          <ui-accordion-panel class="accordion-panel">The details panel.</ui-accordion-panel>
        </ui-accordion-item>
      </ui-accordion>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/accordion")
  root.addEventListener(
    "valuechange",
    (event) => {
      root.querySelector("output")!.textContent = describeValue(
        (event as CustomEvent<{ value: string[] }>).detail.value
      )
    },
    { capture: true }
  )
}

export { mount }
