import type { SliderController } from "@ui-sdk/core/slider"
import "@ui-sdk/web/slider"
import "@ui-sdk/web/field"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-field>
        <ui-slider default-value="40">
          <div data-slot="row">
            <ui-field-label>Volume</ui-field-label>
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
        <button type="button" data-action="mute">Mute</button>
        <button type="button" data-action="louder">Louder</button>
        <button type="button" data-action="read">Read</button>
        <button type="button" data-action="focus">Focus</button>
      </div>
      <output data-slot="output" hidden></output>
    </div>
  `
  const slider = root.querySelector("ui-slider") as HTMLElement & { api: SliderController<number> }
  const volume = slider.api
  const reading = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    mute: () => volume.setValue(0),
    louder: () => volume.setValue(volume.getValue() + 10),
    read: () => {
      reading.textContent = `Volume is ${volume.getValue()}.`
      reading.hidden = false
    },
    focus: () => volume.focus(),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[button.dataset.action!]())
  })
}

export { mount }
