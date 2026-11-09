import "@ui-sdk/web/collapsible"
import { mountWhenAsked, perfSize } from "tests/fixtures/perf.ts"

// N closed collapsibles, like the folders of a long tree.
// With ?found, closed panels stay in the page for find in page.
function mount(root: HTMLElement) {
  const found = new URLSearchParams(location.search).has("found")
  mountWhenAsked(root, (target) => {
    const items = Array.from(
      { length: perfSize(200) },
      (_, index) => `
        <ui-collapsible class="collapsible-row">
          <ui-collapsible-trigger><button class="collapsible-trigger">Folder ${index + 1}</button></ui-collapsible-trigger>
          <ui-collapsible-panel class="collapsible-panel"${found ? " hidden-until-found" : ""}>Files ${index + 1}</ui-collapsible-panel>
        </ui-collapsible>`
    ).join("")
    target.innerHTML = `
      <div class="fixture" style="flex-direction: column; align-items: start">
        <button>Before</button>
        ${items}
        <button>After</button>
      </div>
    `
  })
}

export { mount }
