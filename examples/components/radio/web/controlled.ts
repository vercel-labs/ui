import "@ui-sdk/web/radio"

const plans = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-radio-group default-value="pro" aria-label="Plan">
        ${plans
          .map(
            (plan) => `
              <label data-slot="label">
                <ui-radio value="${plan.value}">
                  <ui-radio-indicator></ui-radio-indicator>
                </ui-radio>
                ${plan.label}
              </label>`,
          )
          .join("")}
      </ui-radio-group>
      <button type="button">Choose Team</button>
      <div data-slot="stack">
        <output data-slot="output">Value: pro</output>
      </div>
    </div>
  `
  const radioGroup = root.querySelector("ui-radio-group")!
  root.querySelector("button")!.addEventListener("click", () => {
    radioGroup.value = "team"
  })
  radioGroup.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: string | null; reason: string }>).detail
    root.querySelector("output")!.textContent = `Value: ${value ?? "none"}, last change: ${reason}`
  })
}

export { mount }
