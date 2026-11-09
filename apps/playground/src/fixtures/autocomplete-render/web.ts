import { autocompleteFixture as f } from "tests/fixtures/autocomplete.ts"

// A suggestion rendered as a link through as-child.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-autocomplete name="${f.name}">
        <ui-autocomplete-label class="label">${f.label}</ui-autocomplete-label>
        <ui-autocomplete-input><input class="input" /></ui-autocomplete-input>
        <ui-autocomplete-trigger><button type="button" aria-label="${f.trigger}">▾</button></ui-autocomplete-trigger>
        <ui-autocomplete-content class="popup list-popup">
          <ui-autocomplete-list>
            <ui-autocomplete-item value="docs" label="Docs" as-child><a class="item" href="#docs">Docs</a></ui-autocomplete-item>
            ${f.items
              .slice(0, 3)
              .map(
                (item) =>
                  `<ui-autocomplete-item class="item" value="${item.value}" label="${item.label}">${item.label}</ui-autocomplete-item>`
              )
              .join("")}
          </ui-autocomplete-list>
        </ui-autocomplete-content>
      </ui-autocomplete>
      <button>After</button>
    </div>`
  await import("@ui-sdk/web/autocomplete")
}

export { mount }
