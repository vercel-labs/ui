import "@ui-sdk/web/switch"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div dir="rtl">
      <label data-slot="label">
        <ui-switch>
          <ui-switch-thumb></ui-switch-thumb>
        </ui-switch>
        وضع الطيران
      </label>
    </div>
  `
}
