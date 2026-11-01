import "@ui-sdk/web/radio"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-radio-group default-value="system" aria-label="Theme">
      ${themes
        .map(
          (theme) => `
            <label data-slot="label">
              <ui-radio value="${theme.value}">
                <ui-radio-indicator keep-mounted></ui-radio-indicator>
              </ui-radio>
              ${theme.label}
            </label>`,
        )
        .join("")}
    </ui-radio-group>
  `
}

export { mount }
