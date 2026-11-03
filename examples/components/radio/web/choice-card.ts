import "@ui-sdk/web/radio"

const plans = [
  { value: "plus", label: "Plus", description: "For individuals and small teams." },
  { value: "pro", label: "Pro", description: "For growing businesses." },
  { value: "enterprise", label: "Enterprise", description: "For large teams and enterprises." },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-radio-group default-value="plus" aria-label="Plan">
      ${plans
        .map(
          (plan) => `
            <label data-slot="card">
              <span data-slot="stack">
                <span>${plan.label}</span>
                <span data-slot="hint">${plan.description}</span>
              </span>
              <ui-radio value="${plan.value}">
                <ui-radio-indicator></ui-radio-indicator>
              </ui-radio>
            </label>`,
        )
        .join("")}
    </ui-radio-group>
  `
}

export { mount }
