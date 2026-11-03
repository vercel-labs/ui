import "@ui-sdk/web/drawer"

const places = [
  { name: "Blue Bottle Coffee", detail: "Coffee · 0.2 mi" },
  { name: "Tartine Bakery", detail: "Bakery · 0.4 mi" },
  { name: "Dolores Park", detail: "Park · 0.5 mi" },
  { name: "Mission Dolores", detail: "Landmark · 0.6 mi" },
  { name: "Ritual Coffee Roasters", detail: "Coffee · 0.7 mi" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ul data-slot="list" aria-label="Places">
        ${places
          .map(
            (place) => `<li>
              <button type="button" data-place="${place.name}">
                ${place.name}
                <span data-slot="hint">${place.detail}</span>
              </button>
            </li>`,
          )
          .join("")}
      </ul>
      <ui-drawer snap-points="0.2,0.6" modal-above="0.2">
        <ui-drawer-trigger><button>Get directions</button></ui-drawer-trigger>
        <ui-drawer-backdrop></ui-drawer-backdrop>
        <ui-drawer-content>
          <ui-drawer-handle><button aria-label="Resize"></button></ui-drawer-handle>
          <div data-slot="row">
            <div data-slot="stack">
              <ui-drawer-title></ui-drawer-title>
              <ui-drawer-description>
                <span>The page behind stays usable. Pick another place.</span>
                <span>Modal now. Drag it down to use the page again.</span>
              </ui-drawer-description>
            </div>
            <ui-drawer-close><button>Done</button></ui-drawer-close>
          </div>
          <ol data-slot="stack">
            <li>Head north on Valencia St.</li>
            <li>Turn left onto 18th St.</li>
            <li data-arrive></li>
          </ol>
        </ui-drawer-content>
      </ui-drawer>
    </div>
  `
  const title = root.querySelector("ui-drawer-title")!
  const arrival = root.querySelector("[data-arrive]")!
  const buttons = [...root.querySelectorAll<HTMLButtonElement>("[data-place]")]
  const select = (destination: string) => {
    for (const button of buttons)
      button.setAttribute("aria-pressed", String(button.dataset.place === destination))
    title.textContent = `To ${destination}`
    arrival.textContent = `Arrive at ${destination}.`
  }
  for (const button of buttons) button.addEventListener("click", () => select(button.dataset.place!))
  select(places[0].name)
}

export { mount }
