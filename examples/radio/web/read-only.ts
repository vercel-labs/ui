import "@ui-sdk/web/radio"

const plans = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "team", label: "Team" },
]

function mount(root: HTMLElement) {
  const id = crypto.randomUUID()
  root.innerHTML = `
    <div data-slot="stack">
      <div data-slot="stack">
        <span id="${id}-current-plan">Your plan</span>
        <p data-slot="hint" id="${id}-current-plan-hint">Ask an admin to change plans.</p>
      </div>
      <ui-radio-group
        default-value="pro"
        read-only
        aria-labelledby="${id}-current-plan"
        aria-describedby="${id}-current-plan-hint"
      >
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
    </div>
  `
}

export { mount }
