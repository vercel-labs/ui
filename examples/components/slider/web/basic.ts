import "@ui-sdk/web/slider"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-slider default-value="75">
      <ui-slider-control>
        <ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator>
          <ui-slider-thumb aria-label="Volume"></ui-slider-thumb>
        </ui-slider-track>
      </ui-slider-control>
    </ui-slider>
  `
}

export { mount }
