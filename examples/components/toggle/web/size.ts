import "@ui-sdk/web/toggle"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-toggle>
        <button data-variant="outline" data-size="sm">Small</button>
      </ui-toggle>
      <ui-toggle>
        <button data-variant="outline">Default</button>
      </ui-toggle>
      <ui-toggle>
        <button data-variant="outline" data-size="lg">Large</button>
      </ui-toggle>
    </div>
  `
}
