import type { ListData } from "@ui-sdk/core/autocomplete"
import "@ui-sdk/web/autocomplete"

const groupedFruits: ListData = [
  { type: "group", label: "Tree fruits", items: ["Apple", "Apricot", "Cherry", "Lemon", "Peach", "Pear"] },
  { type: "separator" },
  { type: "group", label: "Berries", items: ["Blackberry", "Blueberry", "Grape", "Strawberry"] },
  { type: "separator" },
  { type: "group", label: "Tropical", items: ["Avocado", "Banana", "Mango", "Pineapple"] },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-autocomplete>
      <div data-slot="stack">
        <ui-autocomplete-label>Fruit</ui-autocomplete-label>
        <ui-autocomplete-input>
          <input placeholder="e.g. Peach" />
        </ui-autocomplete-input>
      </div>
      <template>
        <ui-autocomplete-content>
          <ui-autocomplete-list>
            <ui-autocomplete-group>
              <ui-autocomplete-group-label></ui-autocomplete-group-label>
              <ui-autocomplete-item>
              </ui-autocomplete-item>
            </ui-autocomplete-group>
            <ui-autocomplete-separator></ui-autocomplete-separator>
          </ui-autocomplete-list>
        </ui-autocomplete-content>
      </template>
    </ui-autocomplete>
  `
  const autocomplete = root.querySelector("ui-autocomplete")!
  autocomplete.items = groupedFruits
}

export { mount }
