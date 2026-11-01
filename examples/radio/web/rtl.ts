import "@ui-sdk/web/radio"

const options = [
  { value: "default", label: "افتراضي" },
  { value: "comfortable", label: "مريح" },
  { value: "compact", label: "مضغوط" },
]

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div dir="rtl">
      <ui-radio-group default-value="comfortable" aria-label="الكثافة">
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
    </div>
  `
}

export { mount }
