import "@ui-sdk/web/radio"

const options = [
  { value: "default", label: "Default", description: "Standard spacing for most use cases." },
  { value: "comfortable", label: "Comfortable", description: "More space between elements." },
  { value: "compact", label: "Compact", description: "Minimal spacing for dense layouts." },
]

function mount(root: HTMLElement) {
  const id = crypto.randomUUID()
  root.innerHTML = `
    <ui-radio-group default-value="comfortable" aria-label="Density">
      ${options
        .map(
          (option) => `
            <div data-slot="row">
              <ui-radio
                value="${option.value}"
                id="${id}-density-${option.value}"
                aria-describedby="${id}-density-${option.value}-description"
              >
                <ui-radio-indicator></ui-radio-indicator>
              </ui-radio>
              <div data-slot="stack">
                <label data-slot="label" for="${id}-density-${option.value}">${option.label}</label>
                <p data-slot="hint" id="${id}-density-${option.value}-description">${option.description}</p>
              </div>
            </div>`,
        )
        .join("")}
    </ui-radio-group>
  `
}

export { mount }
