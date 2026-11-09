// Custom elements are the parts themselves, so they render as they are.
// Render functions are React and Vue only.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <ui-slider default-value="40">
        <ui-slider-value class="slider-value"></ui-slider-value>
        <ui-slider-control class="slider-control">
          <ui-slider-track class="slider-track">
            <ui-slider-indicator class="slider-indicator"></ui-slider-indicator>
            <ui-slider-thumb class="slider-thumb" aria-label="Brightness"></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
      <ui-number-input default-value="8" max="9">
        <ui-number-input-control><input aria-label="Count" /></ui-number-input-control>
        <ui-number-input-increment><button aria-label="Increase count">More</button></ui-number-input-increment>
      </ui-number-input>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/slider")
  await import("@ui-sdk/web/number-input")
  const output = root.querySelector("output")!
  root.addEventListener(
    "valuechange",
    (event) => {
      if ((event.target as Element).localName === "ui-slider") {
        output.textContent = `brightness:${(event as CustomEvent).detail.value}`
      }
    },
    { capture: true }
  )
}

export { mount }
