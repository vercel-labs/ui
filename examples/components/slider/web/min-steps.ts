import "@ui-sdk/web/slider"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-slider
      default-value="540/1020"
      min="0"
      max="1440"
      step="15"
      min-steps-between-thumbs="4"
      aria-label="Opening hours"
    >
      <div data-slot="row">
        <span data-slot="label">Opening hours</span>
        <ui-slider-value></ui-slider-value>
      </div>
      <ui-slider-control>
        <ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator>
          <ui-slider-thumb aria-label="Opens"></ui-slider-thumb>
          <ui-slider-thumb aria-label="Closes"></ui-slider-thumb>
        </ui-slider-track>
      </ui-slider-control>
    </ui-slider>
  `
  const slider = root.querySelector("ui-slider") as HTMLElement & { format: (value: number) => string }
  slider.format = (minutes) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`
}

export { mount }
