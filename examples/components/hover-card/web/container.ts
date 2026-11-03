import "@ui-sdk/web/hover-card"

function mount(root: HTMLElement) {
  const id = `hover-card-${crypto.randomUUID()}`
  root.innerHTML = `
    <div data-slot="stack">
      <ui-hover-card container="#${id}">
        <ui-hover-card-trigger><a href="https://example.com/box">Show in the box</a></ui-hover-card-trigger>
        <ui-hover-card-content>
          <p>Portaled</p>
          <p data-slot="hint">This card is in the box below, in the DOM.</p>
        </ui-hover-card-content>
      </ui-hover-card>
      <div data-slot="card">Container<div id="${id}"></div></div>
    </div>
  `
}

export { mount }
