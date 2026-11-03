import "@ui-sdk/web/slider"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-slider default-value="100" min="25" max="400" large-step="25">
      <div data-slot="row">
        <span data-slot="label">Zoom</span>
        <ui-slider-value></ui-slider-value>
      </div>
      <ui-slider-control>
        <ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator>
          <ui-slider-thumb aria-label="Zoom"></ui-slider-thumb>
        </ui-slider-track>
      </ui-slider-control>
      <p data-slot="hint">Focus the thumb and press Page Up to zoom by 25%.</p>
    </ui-slider>
  `
  const slider = root.querySelector("ui-slider") as HTMLElement & { format: Intl.NumberFormatOptions }
  slider.format = { style: "unit", unit: "percent" }
}

export { mount }
