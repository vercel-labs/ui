import "@ui-sdk/web/toggle"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-toggle-group default-value="all" aria-label="Calls">
      <ui-toggle value="all">
        <button data-variant="outline">All</button>
      </ui-toggle>
      <ui-toggle value="missed">
        <button data-variant="outline">Missed</button>
      </ui-toggle>
    </ui-toggle-group>
  `
}
