import "@ui-sdk/web/slider"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-slider default-value="60" aria-label="Brightness">
      <span data-slot="output">Brightness <ui-slider-value></ui-slider-value>%</span>
      <ui-slider-control>
        <ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator>
          <ui-slider-thumb aria-label="Brightness">
            <ui-slider-value></ui-slider-value>
          </ui-slider-thumb>
        </ui-slider-track>
      </ui-slider-control>
    </ui-slider>
  `
}

export { mount }
