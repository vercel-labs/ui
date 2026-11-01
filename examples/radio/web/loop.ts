import "@ui-sdk/web/radio"

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-radio-group default-value="low" loop="false" aria-label="Priority">
      ${priorities
        .map(
          (priority) => `
            <label data-slot="label">
              <ui-radio value="${priority.value}">
                <ui-radio-indicator></ui-radio-indicator>
              </ui-radio>
              ${priority.label}
            </label>`,
        )
        .join("")}
    </ui-radio-group>
  `
}

export { mount }
