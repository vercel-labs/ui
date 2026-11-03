import "@ui-sdk/web/slider"

const channels = [
  { label: "Bass", value: 50 },
  { label: "Treble", value: 25 },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      ${channels
        .map(
          (channel) => `
            <ui-slider orientation="vertical" default-value="${channel.value}">
              <ui-slider-control>
                <ui-slider-track>
                  <ui-slider-indicator></ui-slider-indicator>
                  <ui-slider-thumb aria-label="${channel.label}"></ui-slider-thumb>
                </ui-slider-track>
              </ui-slider-control>
            </ui-slider>`,
        )
        .join("")}
    </div>
  `
}

export { mount }
