import "@ui-sdk/web/tabs"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="overview">
      <ui-tabs-list aria-label="Project">
        <ui-tabs-tab value="overview">
          <button type="button">Overview</button>
        </ui-tabs-tab>
        <ui-tabs-tab value="activity">
          <button type="button">Activity</button>
        </ui-tabs-tab>
        <ui-tabs-tab value="settings">
          <button type="button">Settings</button>
        </ui-tabs-tab>
        <ui-tabs-indicator></ui-tabs-indicator>
      </ui-tabs-list>
      <div data-slot="stack">
        <ui-tabs-panel value="overview">Everything about the project at a glance.</ui-tabs-panel>
        <ui-tabs-panel value="activity">Deploys, comments and reviews from the last week.</ui-tabs-panel>
        <ui-tabs-panel value="settings">Rename, transfer or archive the project.</ui-tabs-panel>
      </div>
    </ui-tabs>
  `
}

export { mount }
