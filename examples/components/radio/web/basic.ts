import "@ui-sdk/web/radio"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-radio-group default-value="comfortable" aria-label="Density">
      ${options
        .map(
          (option) => `
            <label data-slot="label">
              <ui-radio value="${option.value}">
                <ui-radio-indicator></ui-radio-indicator>
              </ui-radio>
              ${option.label}
            </label>`,
        )
        .join("")}
    </ui-radio-group>
  `
}

export { mount }
