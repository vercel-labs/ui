import { segmentedControlOptions } from "tests/fixtures/page.ts"
import { segmentedControlFixture } from "tests/fixtures/segmented-control.ts"

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")

function markup() {
  const items = segmentedControlFixture.items
    .map(
      (item) =>
        `<ui-segmented-control-item value="${item.value}"${item.disabled ? " disabled" : ""}>${escape(item.label)}</ui-segmented-control-item>`
    )
    .join("")
  return `
    <form class="fixture">
      <button type="button">Before</button>
      <ui-segmented-control aria-label="${segmentedControlFixture.label}" name="${segmentedControlFixture.name}">
        <ui-segmented-control-indicator></ui-segmented-control-indicator>${items}
      </ui-segmented-control>
      <button type="button">After</button>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" id="controller">Show calendar</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Submitted"></output>
    </form>
  `
}

async function mount(root: HTMLElement) {
  const { cancel, defaultValue, disabled, orientation } =
    segmentedControlOptions()
  root.innerHTML = markup()
  const control = root.querySelector<
    HTMLElement & { api?: { setValue: (value: string) => void } }
  >("ui-segmented-control")!
  if (defaultValue) {
    control.setAttribute("default-value", defaultValue)
  }
  if (disabled) {
    control.setAttribute("disabled", "")
  }
  if (orientation) {
    control.setAttribute("orientation", orientation)
  }
  await import("@ui-sdk/web/segmented-control")
  const form = root.querySelector("form")!
  const [action, submitted] = root.querySelectorAll("output")
  root
    .querySelector("#controller")!
    .addEventListener("click", () => control.api?.setValue("calendar"))
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    submitted!.textContent = Array.from(
      new FormData(form),
      ([key, value]) => `${key}=${value}`
    ).join("&")
  })
  root.addEventListener(
    "valuechange",
    (event) => {
      const detail = (
        event as CustomEvent<{ value: string | null; reason: string }>
      ).detail
      if (detail.value === cancel) {
        return event.preventDefault()
      }
      action!.textContent = `${detail.value}:${detail.reason}`
    },
    { capture: true }
  )
}

export { mount }
