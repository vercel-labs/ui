import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/label"
import "@ui-sdk/web/number-input"
import "@ui-sdk/web/radio"
import "@ui-sdk/web/slider"
import { labelFixture } from "tests/fixtures/label.ts"

const { email, plan, volume, terms, region, delivery, quantity } = labelFixture

const radios = (items: { value: string; label: string }[]) =>
  items.map((item) => `<ui-radio class="radio" value="${item.value}">${item.label}</ui-radio>`).join("")

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-label for="${email.id}">${email.label}</ui-label>
      <input id="${email.id}" />
      <ui-label for="${plan.id}">${plan.label}</ui-label>
      <ui-radio-group id="${plan.id}" class="radio-group" default-value="${plan.defaultValue}">${radios(plan.items)}</ui-radio-group>
      <ui-label for="${volume.id}">${volume.label}</ui-label>
      <ui-slider id="${volume.id}" class="slider" default-value="${volume.defaultValue}">
        <ui-slider-control>
          <ui-slider-track class="slider-track"><ui-slider-thumb class="slider-thumb"></ui-slider-thumb></ui-slider-track>
        </ui-slider-control>
      </ui-slider>
      <ui-label><ui-checkbox class="checkbox"></ui-checkbox>${terms.label}</ui-label>
      <ui-label for="${region.id}">${region.label}</ui-label>
      <ui-radio-group id="${region.id}" class="radio-group" disabled>${radios(region.items)}</ui-radio-group>
      <ui-label for="${delivery.id}">${delivery.label}</ui-label>
      <ui-radio-group id="${delivery.id}" class="radio-group" aria-label="${delivery.name}">${radios(delivery.items)}</ui-radio-group>
      <ui-label for="${quantity.id}">${quantity.label}</ui-label>
      <button id="show">${quantity.show}</button>
      <button>After</button>
    </div>
  `
  root.querySelector("#show")!.addEventListener("click", (event) => {
    const input = document.createElement("ui-number-input")
    input.id = quantity.id
    input.setAttribute("default-value", String(quantity.defaultValue))
    input.innerHTML = "<ui-number-input-control><input /></ui-number-input-control>"
    ;(event.currentTarget as HTMLElement).replaceWith(input)
  })
}

export { mount }
