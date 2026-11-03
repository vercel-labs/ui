import "@ui-sdk/web/progress"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-progress>
      <ui-progress-label>Connecting</ui-progress-label>
      <ui-progress-track>
        <ui-progress-indicator></ui-progress-indicator>
      </ui-progress-track>
    </ui-progress>
  `
}
