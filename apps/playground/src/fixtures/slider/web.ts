import { serialize, sliderFixture as f, sliderOptions } from "tests/fixtures/slider.ts"

function markup(options: ReturnType<typeof sliderOptions>) {
  const shared = [
    options.disabled && " disabled",
    options.largeStep !== undefined && ` large-step="${options.largeStep}"`,
  ]
    .filter(Boolean)
    .join("")
  const minSteps = options.minSteps === undefined ? "" : ` min-steps-between-thumbs="${options.minSteps}"`
  const track = (thumbs: string) => `
    <ui-slider-control class="slider-control">
      <ui-slider-track class="slider-track">
        <ui-slider-indicator class="slider-indicator"></ui-slider-indicator>
        ${thumbs}
      </ui-slider-track>
    </ui-slider-control>`
  return `
    <div class="fixture">
      <button>Before</button>
      <form class="form" aria-label="${f.formLabel}">
        <ui-field>
          <ui-field-label>${f.volume.label}</ui-field-label>
          <ui-slider id="volume" name="${f.volume.name}" default-value="${options.volume}"${shared}>
            <ui-slider-value class="slider-value"></ui-slider-value>
            ${track(`<ui-slider-thumb class="slider-thumb"></ui-slider-thumb>`)}
          </ui-slider>
          <ui-field-description>${f.volume.description}</ui-field-description>
        </ui-field>

        <ui-field>
          <ui-field-label>${f.price.label}</ui-field-label>
          <ui-slider id="price" name="${f.price.name}" default-value="${options.price.join("/")}"${shared}${minSteps}>
            <ui-slider-value class="slider-value"></ui-slider-value>
            ${track(
              f.price.thumbs
                .map(
                  (label) => `<ui-slider-thumb class="slider-thumb" aria-label="${label}"></ui-slider-thumb>`,
                )
                .join(""),
            )}
          </ui-slider>
        </ui-field>

        <div class="row">
          <button type="submit">Save</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
      <output role="status" aria-label="Committed"></output>
      <output role="status" aria-label="Submitted" id="submitted"></output>
    </div>
  `
}

async function mount(root: HTMLElement) {
  const options = sliderOptions()
  const template = document.createElement("template")
  template.innerHTML = markup(options)
  // URL options go in as attributes, never as markup, so a crafted URL can't add elements.
  for (const slider of template.content.querySelectorAll("ui-slider")) {
    if (options.orientation) slider.setAttribute("orientation", options.orientation)
    if (options.locale) slider.setAttribute("locale", options.locale)
  }
  root.replaceChildren(template.content)
  // Rich options are properties, set before the elements upgrade.
  const volume = root.querySelector("#volume") as HTMLElement & { format?: unknown }
  const price = root.querySelector("#price") as HTMLElement & { format?: unknown }
  volume.format = options.volumeFormat
  price.format = options.format
  await import("@ui-sdk/web/slider")
  await import("@ui-sdk/web/field")

  const form = root.querySelector("form")!
  const action = root.querySelector<HTMLOutputElement>('output[aria-label="Last action"]')!
  const committed = root.querySelector<HTMLOutputElement>('output[aria-label="Committed"]')!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    root.querySelector("#submitted")!.textContent = serialize(form)
  })

  // Callbacks are DOM events: valuechange while it moves, valuecommit when it settles.
  root.addEventListener(
    "valuechange",
    (event) => {
      const name = (event.target as HTMLElement).getAttribute("name") ?? ""
      if (options.cancel === name) return event.preventDefault()
      action.textContent = `${name}:${String((event as CustomEvent<{ value: number | number[] }>).detail.value)}`
    },
    { capture: true },
  )
  root.addEventListener(
    "valuecommit",
    (event) => {
      const name = (event.target as HTMLElement).getAttribute("name") ?? ""
      const value = String((event as CustomEvent<{ value: number | number[] }>).detail.value)
      committed.textContent = [committed.textContent, `${name}:${value}`].filter(Boolean).join(" ")
    },
    { capture: true },
  )
}

export { mount }
