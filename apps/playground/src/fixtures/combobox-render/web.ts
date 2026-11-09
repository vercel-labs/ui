import { comboboxFixture as f } from "tests/fixtures/combobox.ts"

// An item rendered as a link through as-child.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-combobox name="${f.name}">
        <ui-combobox-label class="label">${f.label}</ui-combobox-label>
        <ui-combobox-input><input class="input" /></ui-combobox-input>
        <ui-combobox-trigger><button aria-label="${f.trigger}">▾</button></ui-combobox-trigger>
        <ui-combobox-content class="popup list-popup">
          <ui-combobox-list>
            <ui-combobox-item value="docs" label="Docs" as-child><a class="item" href="#docs">Docs</a></ui-combobox-item>
            ${f.items
              .slice(0, 3)
              .map(
                (item) =>
                  `<ui-combobox-item class="item" value="${item.value}" label="${item.label}">${item.label}</ui-combobox-item>`
              )
              .join("")}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
      <button>After</button>
    </div>`
  await import("@ui-sdk/web/combobox")
}

export { mount }
