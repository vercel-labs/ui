import "@ui-sdk/web/separator"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <dl>
        <dt>Item 1</dt>
        <dd>Value 1</dd>
      </dl>
      <ui-separator></ui-separator>
      <dl>
        <dt>Item 2</dt>
        <dd>Value 2</dd>
      </dl>
      <ui-separator></ui-separator>
      <dl>
        <dt>Item 3</dt>
        <dd>Value 3</dd>
      </dl>
    </div>
  `
}
