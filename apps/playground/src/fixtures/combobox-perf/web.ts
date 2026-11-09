import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// A long combobox for the counts specs. Web components have no
// renders to count.
async function mount(root: HTMLElement) {
  const items = perfItems(perfSize())
    .map(
      (item) =>
        `<ui-combobox-item class="item" value="${item.value}" label="${item.label}">${item.label}</ui-combobox-item>`
    )
    .join("")
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-combobox>
        <ui-combobox-input><input class="input" aria-label="Search" /></ui-combobox-input>
        <ui-combobox-content class="popup list-popup">
          <ui-combobox-list>${items}</ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
      <button>After</button>
    </div>
  `
  await import("@ui-sdk/web/combobox")
}

export { mount }
