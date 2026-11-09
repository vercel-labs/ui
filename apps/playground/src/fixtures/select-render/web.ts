import { selectFixture as f } from "tests/fixtures/select.ts"

// An item rendered as a link through as-child.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-select name="${f.name}" placeholder="${f.placeholder}">
        <ui-select-label class="label">${f.label}</ui-select-label>
        <ui-select-trigger><button class="trigger"></button></ui-select-trigger>
        <ui-select-content class="popup list-popup">
          <ui-select-item value="docs" as-child><a class="item" href="#docs">Docs</a></ui-select-item>
          ${f.items
            .slice(0, 3)
            .map(
              (item) =>
                `<ui-select-item class="item" value="${item.value}">${item.label}</ui-select-item>`
            )
            .join("")}
        </ui-select-content>
      </ui-select>
      <button>After</button>
    </div>`
  await import("@ui-sdk/web/select")
}

export { mount }
