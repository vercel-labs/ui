import "@ui-sdk/web/tabs"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="preview" activation="manual">
      <ui-tabs-list aria-label="Snippet">
        <ui-tabs-tab value="preview">
          <button type="button">Preview</button>
        </ui-tabs-tab>
        <ui-tabs-tab value="code">
          <button type="button">Code</button>
        </ui-tabs-tab>
        <ui-tabs-tab value="tests" disabled>
          <button type="button">Tests</button>
        </ui-tabs-tab>
      </ui-tabs-list>
      <ui-tabs-panel value="preview">The rendered snippet.</ui-tabs-panel>
      <ui-tabs-panel value="code">
        Edit the snippet's source.
        <input aria-label="Source" value="&lt;Tabs /&gt;" />
      </ui-tabs-panel>
    </ui-tabs>
  `
}

export { mount }
