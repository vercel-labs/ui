import "@ui-sdk/web/slider"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-slider id="year" default-value="2010" min="1990" max="2030" step="5">
        <div data-slot="row">
          <span data-slot="label">Year</span>
          <ui-slider-value></ui-slider-value>
        </div>
        <ui-slider-control>
          <ui-slider-track>
            <ui-slider-indicator></ui-slider-indicator>
            <ui-slider-thumb aria-label="Year"></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
      <ui-slider default-value="0.5" min="0" max="1" step="0.05">
        <div data-slot="row">
          <span data-slot="label">Opacity</span>
          <ui-slider-value></ui-slider-value>
        </div>
        <ui-slider-control>
          <ui-slider-track>
            <ui-slider-indicator></ui-slider-indicator>
            <ui-slider-thumb aria-label="Opacity"></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
    </div>
  `
  const year = root.querySelector("#year") as HTMLElement & { format: Intl.NumberFormatOptions }
  year.format = { useGrouping: false }
}

export { mount }
