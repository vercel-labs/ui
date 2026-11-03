import "@ui-sdk/web/autocomplete"

const fruits = [
  "Apple",
  "Apricot",
  "Avocado",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grape",
  "Lemon",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
  "Pineapple",
  "Strawberry",
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-autocomplete debug>
        <ui-autocomplete-label>Fruit (12 characters at most)</ui-autocomplete-label>
        <ui-autocomplete-input>
          <input />
        </ui-autocomplete-input>
        <ui-autocomplete-content>
          <ui-autocomplete-list>
            ${fruits.map((fruit) => `<ui-autocomplete-item value="${fruit}">${fruit}</ui-autocomplete-item>`).join("")}
          </ui-autocomplete-list>
        </ui-autocomplete-content>
      </ui-autocomplete>
      <output data-slot="output">Type something</output>
    </div>
  `
  const autocomplete = root.querySelector("ui-autocomplete")!
  const log = root.querySelector("output")!
  autocomplete.addEventListener("valuechange", (event) => {
    if (event.detail.value.length > 12) return event.preventDefault()
    log.textContent = `text: ${event.detail.reason}`
  })
  autocomplete.addEventListener("openchange", (event) => {
    log.textContent = `${event.detail.value ? "opened" : "closed"}: ${event.detail.reason}`
  })
  autocomplete.addEventListener("openchangecomplete", (event) => {
    log.textContent = `${event.detail.value ? "opened" : "closed"} and settled`
  })
  autocomplete.addEventListener("highlight", (event) => {
    if (event.detail.value) log.textContent = `highlighted ${event.detail.value}`
  })
}
