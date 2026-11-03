import "@ui-sdk/web/slider"

const thumbs = ["Low", "Medium", "High"]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-slider default-value="10/20/70" step="10">
      <ui-slider-control>
        <ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator>
          ${thumbs.map((label) => `<ui-slider-thumb aria-label="${label}"></ui-slider-thumb>`).join("")}
        </ui-slider-track>
      </ui-slider-control>
    </ui-slider>
  `
}

export { mount }
