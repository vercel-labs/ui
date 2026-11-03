import "@ui-sdk/web/separator"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="row">
      <ui-separator decorative></ui-separator>
      <span>or</span>
      <ui-separator decorative></ui-separator>
    </div>
  `
}
