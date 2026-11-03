import "@ui-sdk/web/autocomplete"

const recent = ["react hooks", "tailwind grid", "web components", "vue v-model"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <form role="search" data-slot="stack">
      <ui-autocomplete submit-on-select name="q">
        <ui-autocomplete-input>
          <input type="search" aria-label="Search" placeholder="Search…" />
        </ui-autocomplete-input>
        <ui-autocomplete-content>
          <ui-autocomplete-list>
            ${recent.map((search) => `<ui-autocomplete-item value="${search}">${search}</ui-autocomplete-item>`).join("")}
          </ui-autocomplete-list>
        </ui-autocomplete-content>
      </ui-autocomplete>
      <output data-slot="output">Press Enter to search</output>
    </form>
  `
  const output = root.querySelector("output")!
  root.querySelector("form")!.addEventListener("submit", (event) => event.preventDefault())
  root.querySelector("ui-autocomplete")!.addEventListener("submit", (event) => {
    output.textContent = `Searched “${event.detail.value}”`
  })
}

export { mount }
