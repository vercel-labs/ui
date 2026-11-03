import "@ui-sdk/web/slider"
import "@ui-sdk/web/field"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <div data-slot="row">
        <ui-field-label>Temperature</ui-field-label>
        <span data-slot="output">0.3, 0.7</span>
      </div>
      <ui-slider default-value="0.3/0.7" min="0" max="1" step="0.1">
        <ui-slider-control>
          <ui-slider-track>
            <ui-slider-indicator></ui-slider-indicator>
            <ui-slider-thumb aria-label="Minimum temperature"></ui-slider-thumb>
            <ui-slider-thumb aria-label="Maximum temperature"></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
      <div data-slot="row">
        <button type="button">Reset</button>
      </div>
      <output data-slot="output">Drag a thumb.</output>
    </ui-field>
  `
  const slider = root.querySelector("ui-slider") as HTMLElement & { value: number[] }
  const shown = root.querySelector("span")!
  const output = root.querySelector("output")!
  slider.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: number[]; reason: string }>).detail
    shown.textContent = value.join(", ")
    output.textContent = `Last change: ${reason}`
  })
  root.querySelector("button")!.addEventListener("click", () => {
    slider.value = [0.3, 0.7]
    output.textContent = "Drag a thumb."
  })
}

export { mount }
