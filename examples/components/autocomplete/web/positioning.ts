import "@ui-sdk/web/autocomplete"

const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry"]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div id="autocomplete-positioning-box" data-slot="card">
      <ui-autocomplete modal="pointer" container="#autocomplete-positioning-box">
        <ui-autocomplete-label>Fruit</ui-autocomplete-label>
        <ui-autocomplete-input>
          <input />
        </ui-autocomplete-input>
        <ui-autocomplete-content side="top" align="end" side-offset="10" align-offset="-4" collision-padding="8" anchor="#autocomplete-positioning-box" keep-mounted>
          <ui-autocomplete-arrow></ui-autocomplete-arrow>
          <ui-autocomplete-list>
            ${fruits.map((fruit) => `<ui-autocomplete-item value="${fruit}">${fruit}</ui-autocomplete-item>`).join("")}
          </ui-autocomplete-list>
        </ui-autocomplete-content>
      </ui-autocomplete>
    </div>
  `
}
