import "@ui-sdk/web/progress"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-progress value="60">
      <ui-progress-label>Loading</ui-progress-label>
      <ui-progress-value></ui-progress-value>
      <ui-progress-track>
        <ui-progress-indicator></ui-progress-indicator>
      </ui-progress-track>
    </ui-progress>
  `
}
