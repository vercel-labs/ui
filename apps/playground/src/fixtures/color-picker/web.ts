import { colorPickerOptions } from "tests/fixtures/page.ts"
import { colorPickerFixture } from "tests/fixtures/color-picker.ts"

function markup(oklch: boolean) {
  const swatches = colorPickerFixture.swatches
    .map((swatch) => `<ui-color-picker-swatch-item value="${swatch}"></ui-color-picker-swatch-item>`)
    .join("")
  return `
    <form class="fixture">
      <button type="button">Before</button>
      <ui-color-picker aria-label="${colorPickerFixture.label}" name="${colorPickerFixture.name}">
        <ui-color-picker-area>
          ${oklch ? "<ui-color-picker-area-canvas></ui-color-picker-area-canvas>" : ""}
          <ui-color-picker-area-thumb></ui-color-picker-area-thumb>
        </ui-color-picker-area>
        <ui-color-picker-slider channel="hue"><ui-color-picker-slider-thumb></ui-color-picker-slider-thumb></ui-color-picker-slider>
        <ui-color-picker-slider channel="alpha"><ui-color-picker-slider-thumb></ui-color-picker-slider-thumb></ui-color-picker-slider>
        <ui-color-picker-input><input aria-label="${colorPickerFixture.inputLabel}" /></ui-color-picker-input>
        <ui-color-picker-channel-input channel="alpha"></ui-color-picker-channel-input>
        <ui-color-picker-swatch></ui-color-picker-swatch>
        <ui-color-picker-eye-dropper>Pick from screen</ui-color-picker-eye-dropper>
        <ui-color-picker-swatches aria-label="Presets">${swatches}</ui-color-picker-swatches>
      </ui-color-picker>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" id="controller">Use purple</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Committed"></output>
      <output aria-label="Submitted"></output>
    </form>
  `
}

async function mount(root: HTMLElement) {
  const { cancel, defaultValue, disabled, readOnly, space, format, gamut } = colorPickerOptions()
  root.innerHTML = markup(space === "oklch")
  const picker = root.querySelector<HTMLElement & { api?: { setValue: (value: string) => void } }>(
    "ui-color-picker",
  )!
  picker.setAttribute("default-value", defaultValue)
  if (disabled) picker.setAttribute("disabled", "")
  if (readOnly) picker.setAttribute("read-only", "")
  if (space) picker.setAttribute("space", space)
  if (format) picker.setAttribute("format", format)
  if (gamut !== undefined) picker.setAttribute("gamut", String(gamut))
  await import("@ui-sdk/web/color-picker")
  const form = root.querySelector("form")!
  const [action, committed, submitted] = root.querySelectorAll("output")
  root.querySelector("#controller")!.addEventListener("click", () => picker.api?.setValue("rebeccapurple"))
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    submitted!.textContent = Array.from(new FormData(form), ([key, value]) => `${key}=${value}`).join("&")
  })
  root.addEventListener(
    "valuechange",
    (event) => {
      const detail = (event as CustomEvent<{ value: string; reason: string }>).detail
      if (cancel) return event.preventDefault()
      action!.textContent = `${detail.value}:${detail.reason}`
    },
    { capture: true },
  )
  root.addEventListener(
    "valuecommit",
    (event) => {
      const detail = (event as CustomEvent<{ value: string; reason: string }>).detail
      committed!.textContent = `${detail.value}:${detail.reason}`
    },
    { capture: true },
  )
}

export { mount }
