import { createLocalStorage, createPreference } from "@ui-sdk/core"
import "@ui-sdk/web/button"
import "@ui-sdk/web/preferences"

function mount(root: HTMLElement) {
  const density = createPreference({
    values: ["comfortable", "compact"],
    defaultValue: "comfortable",
    attribute: "data-density",
    storage: createLocalStorage("ui-sdk-preferences-density"),
  })

  root.innerHTML = `
    <ui-preferences>
      <div data-slot="card">
        <ui-button>
          <button type="button" aria-pressed="false">
            Compact layout
          </button>
        </ui-button>
        <ul data-slot="list" aria-label="Documents">
          <li>Project notes</li>
          <li>Meeting notes</li>
          <li>Release notes</li>
        </ul>
        <span data-slot="hint">Density: comfortable</span>
      </div>
    </ui-preferences>
  `

  const preferences = root.querySelector("ui-preferences")!
  const button = root.querySelector("button")!
  const label = root.querySelector("span")!
  preferences.preferences = [density]

  const update = () => {
    const { value } = density.get()
    button.setAttribute("aria-pressed", String(value === "compact"))
    label.textContent = `Density: ${value}`
  }
  const toggle = (event: MouseEvent) => {
    density.set(density.get().value === "compact" ? "comfortable" : "compact", {
      reason: "press",
      event,
    })
  }

  const stop = density.subscribe(update)
  update()
  button.addEventListener("click", toggle)

  return () => {
    stop()
    button.removeEventListener("click", toggle)
    preferences.preferences = []
  }
}

export { mount }
