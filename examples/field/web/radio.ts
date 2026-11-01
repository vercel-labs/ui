import "@ui-sdk/web/radio"
import "@ui-sdk/web/field"

const plans = [
  { value: "monthly", label: "Monthly ($9.99/month)" },
  { value: "yearly", label: "Yearly ($99.99/year)" },
  { value: "lifetime", label: "Lifetime ($299.99)" },
]

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-field>
      <ui-field-label>Subscription plan</ui-field-label>
      <ui-field-description>Yearly and lifetime plans offer significant savings.</ui-field-description>
      <ui-radio-group name="plan" default-value="monthly">
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
    </ui-field>
  `
}
