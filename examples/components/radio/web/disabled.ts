import "@ui-sdk/web/radio"

function mount(root: HTMLElement) {
  const id = crypto.randomUUID()
  root.innerHTML = `
    <div data-slot="row">
      <div data-slot="stack">
        <span data-slot="hint" id="${id}-theme-heading">Theme</span>
        <ui-radio-group default-value="light" disabled aria-labelledby="${id}-theme-heading">
          <label data-slot="label">
            <ui-radio value="light">
              <ui-radio-indicator></ui-radio-indicator>
            </ui-radio>
            Light
          </label>
          <label data-slot="label">
            <ui-radio value="dark">
              <ui-radio-indicator></ui-radio-indicator>
            </ui-radio>
            Dark
          </label>
          <label data-slot="label">
            <ui-radio value="system">
              <ui-radio-indicator></ui-radio-indicator>
            </ui-radio>
            System
          </label>
        </ui-radio-group>
      </div>
      <div data-slot="stack">
        <span data-slot="hint" id="${id}-notify-heading">Notify me about</span>
        <ui-radio-group default-value="all" aria-labelledby="${id}-notify-heading">
          <label data-slot="label">
            <ui-radio value="all">
              <ui-radio-indicator></ui-radio-indicator>
            </ui-radio>
            All
          </label>
          <label data-slot="label">
            <ui-radio value="mentions" disabled>
              <ui-radio-indicator></ui-radio-indicator>
            </ui-radio>
            Mentions
          </label>
          <label data-slot="label">
            <ui-radio value="nothing">
              <ui-radio-indicator></ui-radio-indicator>
            </ui-radio>
            Nothing
          </label>
        </ui-radio-group>
      </div>
    </div>
  `
}

export { mount }
