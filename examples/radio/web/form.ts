import "@ui-sdk/web/radio"

const methods = [
  { value: "standard", label: "Standard", detail: "Free, 5 to 7 days" },
  { value: "express", label: "Express", detail: "$9, 2 days" },
  { value: "overnight", label: "Overnight", detail: "$24, next day" },
]

function mount(root: HTMLElement) {
  const id = crypto.randomUUID()
  root.innerHTML = `
    <div data-slot="stack">
      <ui-radio-group
        aria-label="Shipping"
        name="shipping"
        form="${id}-shipping-form"
        required
        default-value="standard"
      >
        ${methods
          .map(
            (method) => `
              <label data-slot="label">
                <ui-radio value="${method.value}">
                  <ui-radio-indicator></ui-radio-indicator>
                </ui-radio>
                ${method.label} <span data-slot="hint">${method.detail}</span>
              </label>`,
          )
          .join("")}
      </ui-radio-group>
      <form data-slot="row" id="${id}-shipping-form">
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <output data-slot="output" hidden></output>
    </div>
  `
  const form = root.querySelector("form")!
  const result = root.querySelector("output")!
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    result.hidden = false
    result.textContent = `Submitted: ${JSON.stringify(Object.fromEntries(new FormData(form)))}`
  })
  form.addEventListener("reset", () => {
    result.hidden = true
  })
}

export { mount }
