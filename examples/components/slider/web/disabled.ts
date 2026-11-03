import "@ui-sdk/web/slider"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-slider default-value="50" disabled>
      <ui-slider-control>
        <ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator>
          <ui-slider-thumb aria-label="Disabled"></ui-slider-thumb>
        </ui-slider-track>
      </ui-slider-control>
    </ui-slider>
  `
}

export { mount }
