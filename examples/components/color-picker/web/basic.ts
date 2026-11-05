import "@ui-sdk/web/color-picker"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-color-picker aria-label="Brand color" default-value="#0ea5e9">
      <ui-color-picker-area>
        <ui-color-picker-area-thumb></ui-color-picker-area-thumb>
      </ui-color-picker-area>
      <ui-color-picker-slider channel="hue">
        <ui-color-picker-slider-thumb></ui-color-picker-slider-thumb>
      </ui-color-picker-slider>
      <div data-slot="row">
        <ui-color-picker-swatch></ui-color-picker-swatch>
        <ui-color-picker-input>
          <input aria-label="Hex" />
        </ui-color-picker-input>
      </div>
    </ui-color-picker>
  `
}

export { mount }
