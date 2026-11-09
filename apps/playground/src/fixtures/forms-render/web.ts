// Custom elements are the control themselves, so the span-like cases are the
// elements as they are. Render functions are React and Vue only.
async function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="fixture">
      <button>Before</button>
      <form class="form" aria-label="Rendering">
        <label>
          <ui-checkbox class="checkbox"><ui-checkbox-indicator class="checkbox-indicator"></ui-checkbox-indicator></ui-checkbox>
          Rendered as a span
        </label>
        <label><ui-switch class="switch" default-checked><ui-switch-thumb class="switch-thumb"></ui-switch-thumb></ui-switch> Labelled thumb</label>
        <ui-radio-group aria-label="Size" default-value="small">
          <label><ui-radio class="radio" value="small"></ui-radio>Small</label>
          <label><ui-radio class="radio" value="large"></ui-radio>Large</label>
        </ui-radio-group>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action"></output>
    </div>
  `
  await import("@ui-sdk/web/checkbox")
  await import("@ui-sdk/web/switch")
  await import("@ui-sdk/web/radio")
  const output = root.querySelector("output")!
  root
    .querySelector("form")!
    .addEventListener("submit", (event) => event.preventDefault())
  root.addEventListener(
    "checkedchange",
    (event) => {
      if ((event.target as Element).localName === "ui-checkbox") {
        output.textContent = `span:${(event as CustomEvent).detail.value}`
      }
    },
    { capture: true }
  )
  root.addEventListener(
    "valuechange",
    (event) => {
      output.textContent = `size:${(event as CustomEvent).detail.value}`
    },
    { capture: true }
  )
}

export { mount }
