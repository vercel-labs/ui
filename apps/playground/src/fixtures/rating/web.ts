import { ratingOptions } from "tests/fixtures/page.ts"
import { ratingFixture } from "tests/fixtures/rating.ts"

const { quality, value, average } = ratingFixture

type RatingElement = HTMLElement & {
  api?: { setValue: (value: number) => void }
  getValueLabel?: (value: number, max: number) => string
}

function markup() {
  return `
    <form class="fixture">
      <button type="button">Before</button>
      <ui-rating id="quality" aria-label="${quality.label}" name="${quality.name}" default-value="${quality.defaultValue}">
        <template><ui-rating-item><span class="star"></span></ui-rating-item></template>
      </ui-rating>
      <button type="button">After</button>
      <ui-rating aria-label="${value.label}" name="${value.name}" step="${value.step}" deselectable></ui-rating>
      <ui-rating id="average" value="${average.value}" read-only></ui-rating>
      <button type="submit">Save</button>
      <button type="reset">Reset</button>
      <button type="button" id="controller">Rate five</button>
      <output role="status" aria-label="Last action"></output>
      <output aria-label="Submitted"></output>
    </form>
  `
}

async function mount(root: HTMLElement) {
  const { cancel, disabled } = ratingOptions()
  root.innerHTML = markup()
  const rating = root.querySelector<RatingElement>("#quality")!
  if (disabled) rating.setAttribute("disabled", "")
  root.querySelector<RatingElement>("#average")!.getValueLabel = average.getValueLabel
  await import("@ui-sdk/web/rating")
  const form = root.querySelector("form")!
  const [action, submitted] = root.querySelectorAll("output")
  root.querySelector("#controller")!.addEventListener("click", () => rating.api?.setValue(5))
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    submitted!.textContent = Array.from(new FormData(form), ([key, entry]) => `${key}=${entry}`).join("&")
  })
  root.addEventListener(
    "valuechange",
    (event) => {
      if (event.target !== rating) return
      const detail = (event as CustomEvent<{ value: number | null; reason: string }>).detail
      if (detail.value === cancel) return event.preventDefault()
      action!.textContent = `${detail.value}:${detail.reason}`
    },
    { capture: true },
  )
}

export { mount }
