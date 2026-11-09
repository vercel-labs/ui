import "@ui-sdk/web/select"
import { mountWhenAsked, perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long select for the counts specs. Web components have no
// renders to count.
function mount(root: HTMLElement) {
  mountWhenAsked(root, (target) => {
    const items = perfItems(perfSize())
      .map(
        (item) =>
          `<ui-select-item class="item" value="${item.value}">${item.label}</ui-select-item>`
      )
      .join("")
    target.innerHTML = `
      <div class="fixture">
        <button>Before</button>
        <ui-select default-value="item-1">
          <ui-select-trigger><button class="trigger" aria-label="Pick"><ui-select-value></ui-select-value></button></ui-select-trigger>
          <ui-select-content class="popup list-popup">${items}</ui-select-content>
        </ui-select>
        <button>After</button>
      </div>
    `
  })
}

export { mount }
