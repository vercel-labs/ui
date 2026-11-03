import "@ui-sdk/web/progress"

export function mount(root: HTMLElement) {
  const value = 18
  root.innerHTML = `
    <ui-progress value="${value}">
      <ui-progress-label>Battery</ui-progress-label>
      <span data-slot="hint"><ui-progress-value></ui-progress-value> charged</span>
      <ui-progress-track>
        <ui-progress-indicator${value < 20 ? ' data-variant="destructive"' : ""}></ui-progress-indicator>
      </ui-progress-track>
    </ui-progress>
  `
}
