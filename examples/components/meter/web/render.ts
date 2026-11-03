import "@ui-sdk/web/meter"

export function mount(root: HTMLElement) {
  const value = 91
  root.innerHTML = `
    <ui-meter value="${value}">
      <ui-meter-label>Disk</ui-meter-label>
      <span data-slot="hint"><ui-meter-value></ui-meter-value> used</span>
      <ui-meter-track>
        <ui-meter-indicator${value >= 90 ? ' data-variant="destructive"' : ""}></ui-meter-indicator>
      </ui-meter-track>
    </ui-meter>
  `
}
