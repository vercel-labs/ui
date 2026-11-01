import "@ui-sdk/web/field"
import "@ui-sdk/web/radio"

const plans = [
  { value: "monthly", label: "Monthly", price: "$12 a month" },
  { value: "yearly", label: "Yearly", price: "$120 a year" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field-set>
      <fieldset data-slot="stack">
        <ui-field-legend>Billing period</ui-field-legend>
        <ui-radio-group name="period" default-value="monthly">
          ${plans
            .map(
              (plan) => `
                <label data-slot="card">
                  <span data-slot="row">
                    <ui-radio value="${plan.value}">
                      <ui-radio-indicator></ui-radio-indicator>
                    </ui-radio>
                    ${plan.label}
                  </span>
                  <span data-slot="hint">${plan.price}</span>
                </label>`,
            )
            .join("")}
        </ui-radio-group>
      </fieldset>
    </ui-field-set>
  `
}
