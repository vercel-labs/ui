import "@ui-sdk/web/segmented-control"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-segmented-control aria-label="Vertical alignment" orientation="vertical" default-value="middle">
      <ui-segmented-control-indicator></ui-segmented-control-indicator>
      <ui-segmented-control-item value="top">Top</ui-segmented-control-item>
      <ui-segmented-control-item value="middle">Middle</ui-segmented-control-item>
      <ui-segmented-control-item value="bottom">Bottom</ui-segmented-control-item>
    </ui-segmented-control>
  `
}

export { mount }
