import "@ui-sdk/web/switch"
import "@ui-sdk/web/field"

const options = [
  {
    label: "Share across devices",
    description: "Focus is shared across devices, and turns off when you leave the app.",
    defaultChecked: false,
  },
  {
    label: "Enable notifications",
    description: "Receive notifications when focus mode is enabled or disabled.",
    defaultChecked: true,
  },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      ${options
        .map(
          (option) => `
            <ui-field data-variant="card">
              <div data-slot="stack">
                <ui-field-label>${option.label}</ui-field-label>
                <ui-field-description>${option.description}</ui-field-description>
              </div>
              <ui-switch${option.defaultChecked ? " default-checked" : ""}>
                <ui-switch-thumb></ui-switch-thumb>
              </ui-switch>
            </ui-field>
          `,
        )
        .join("")}
    </div>
  `
}

export { mount }
