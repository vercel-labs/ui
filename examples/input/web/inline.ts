import "@ui-sdk/web/input"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <form data-slot="row" role="search">
      <ui-input>
        <input type="search" name="q" aria-label="Search" placeholder="Search…" />
      </ui-input>
      <button type="submit">Search</button>
    </form>
  `
  root.querySelector("form")!.addEventListener("submit", (event) => event.preventDefault())
}
