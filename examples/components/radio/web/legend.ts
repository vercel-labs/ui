import "@ui-sdk/web/radio"

const plans = [
  { value: "monthly", label: "Monthly", price: "$9.99/month" },
  { value: "yearly", label: "Yearly", price: "$99.99/year" },
  { value: "lifetime", label: "Lifetime", price: "$299.99" },
]

function mount(root: HTMLElement) {
  const id = crypto.randomUUID()
  root.innerHTML = `
    <fieldset data-slot="stack">
      <legend id="${id}-subscription-legend">Subscription plan</legend>
      <p data-slot="hint" id="${id}-subscription-hint">Yearly and lifetime plans offer significant savings.</p>
      <ui-radio-group
        default-value="monthly"
        aria-labelledby="${id}-subscription-legend"
        aria-describedby="${id}-subscription-hint"
      >
        ${plans
          .map(
            (plan) => `
              <label data-slot="label">
                <ui-radio value="${plan.value}">
                  <ui-radio-indicator></ui-radio-indicator>
                </ui-radio>
                ${plan.label} <span data-slot="hint">${plan.price}</span>
              </label>`,
          )
          .join("")}
      </ui-radio-group>
    </fieldset>
  `
}

export { mount }
