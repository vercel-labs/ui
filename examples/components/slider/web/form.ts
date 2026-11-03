import "@ui-sdk/web/slider"
import "@ui-sdk/web/field"

function mount(root: HTMLElement) {
  const formId = `slider-form-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <form id="${formId}" data-slot="stack">
        <ui-field>
          <ui-slider name="price" default-value="200/800" max="1000" step="10">
            <div data-slot="row">
              <ui-field-label>Price</ui-field-label>
              <ui-slider-value></ui-slider-value>
            </div>
            <ui-slider-control>
              <ui-slider-track>
                <ui-slider-indicator></ui-slider-indicator>
                <ui-slider-thumb aria-label="Minimum price"></ui-slider-thumb>
                <ui-slider-thumb aria-label="Maximum price"></ui-slider-thumb>
              </ui-slider-track>
            </ui-slider-control>
          </ui-slider>
        </ui-field>
        <ui-field>
          <ui-slider name="rating" default-value="3" min="1" max="5">
            <div data-slot="row">
              <ui-field-label>Minimum rating</ui-field-label>
              <ui-slider-value></ui-slider-value>
            </div>
            <ui-slider-control>
              <ui-slider-track>
                <ui-slider-indicator></ui-slider-indicator>
                <ui-slider-thumb></ui-slider-thumb>
              </ui-slider-track>
            </ui-slider-control>
          </ui-slider>
        </ui-field>
        <div data-slot="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <ui-field>
        <ui-slider name="distance" form="${formId}" default-value="25" max="100" step="5">
          <div data-slot="row">
            <ui-field-label>Distance</ui-field-label>
            <ui-slider-value></ui-slider-value>
          </div>
          <ui-slider-control>
            <ui-slider-track>
              <ui-slider-indicator></ui-slider-indicator>
              <ui-slider-thumb></ui-slider-thumb>
            </ui-slider-track>
          </ui-slider-control>
        </ui-slider>
      </ui-field>
      <output data-slot="output" hidden></output>
    </div>
  `
  const distance = root.querySelector('ui-slider[name="distance"]') as HTMLElement & {
    format: Intl.NumberFormatOptions
  }
  distance.format = { style: "unit", unit: "kilometer" }
  const form = root.querySelector("form")!
  const submitted = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = [...new FormData(form)].map(([name, value]) => `${name}=${value}`)
    submitted.textContent = `Submitted: ${data.join(", ")}`
    submitted.hidden = false
  })
  form.addEventListener("reset", () => (submitted.hidden = true))
}

export { mount }
