import "@ui-sdk/web/autocomplete"
import { ArrowLeft, createElement } from "lucide"

const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-autocomplete required>
      <div data-slot="stack">
        <ui-autocomplete-label>Fruit</ui-autocomplete-label>
        <ui-autocomplete-input>
          <input />
        </ui-autocomplete-input>
      </div>
      <ui-autocomplete-content>
        <ui-autocomplete-list>
          <ui-autocomplete-item value="Fruit guide"><a href="#fruit-guide" tabindex="-1">Read the fruit guide</a></ui-autocomplete-item>
          ${fruits
            .map(
              (fruit) =>
                `<ui-autocomplete-item value="${fruit}">${fruit}${createElement(ArrowLeft, { "data-show": "highlighted", "aria-hidden": "true" }).outerHTML}</ui-autocomplete-item>`,
            )
            .join("")}
        </ui-autocomplete-list>
      </ui-autocomplete-content>
    </ui-autocomplete>
  `
  const autocomplete = root.querySelector("ui-autocomplete")!
  const link = root.querySelector("a")!
  autocomplete.addEventListener("valuechange", (event) => {
    const { reason, value, source } = event.detail
    if (reason === "item-press" && source === "keyboard" && value === link.textContent) link.click()
  })
}

export { mount }
