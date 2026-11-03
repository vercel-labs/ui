import "@ui-sdk/web/slider"
import "@ui-sdk/web/field"

const save = () => new Promise((resolve) => setTimeout(resolve, 600))

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-slider default-value="50">
        <div data-slot="row">
          <ui-field-label>Brightness</ui-field-label>
          <ui-slider-value></ui-slider-value>
        </div>
        <ui-slider-control>
          <ui-slider-track>
            <ui-slider-indicator></ui-slider-indicator>
            <ui-slider-thumb></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
      <output data-slot="output">
        <span>Changes: 0</span>
        <span>Drag to change the brightness.</span>
      </output>
    </ui-field>
  `
  const slider = root.querySelector("ui-slider")!
  const [changes, status] = root.querySelectorAll("output span")
  let count = 0
  slider.addEventListener("valuechange", () => (changes.textContent = `Changes: ${++count}`))
  slider.addEventListener("valuecommit", async (event) => {
    const { value, reason } = (event as CustomEvent<{ value: number; reason: string }>).detail
    status.textContent = "Saving…"
    await save()
    status.textContent = `Saved ${value} (${reason}).`
  })
}

export { mount }
