import "@ui-sdk/web/tabs"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-tabs default-value="music" orientation="horizontal">
        <ui-tabs-list aria-label="Library">
          <ui-tabs-tab value="music">
            <button type="button">Music</button>
          </ui-tabs-tab>
          <ui-tabs-tab value="podcasts">
            <button type="button">Podcasts</button>
          </ui-tabs-tab>
          <ui-tabs-tab value="audiobooks">
            <button type="button">Audiobooks</button>
          </ui-tabs-tab>
          <ui-tabs-indicator></ui-tabs-indicator>
        </ui-tabs-list>
        <ui-tabs-panel value="music">312 songs, 24 albums.</ui-tabs-panel>
        <ui-tabs-panel value="podcasts">8 shows, 3 new episodes.</ui-tabs-panel>
        <ui-tabs-panel value="audiobooks">2 books in progress.</ui-tabs-panel>
      </ui-tabs>
      <label data-slot="label">
        <input type="checkbox" />
        Vertical
      </label>
    </div>
  `
  const tabs = root.querySelector("ui-tabs")!
  root.querySelector("input")!.addEventListener("change", (event) => {
    tabs.setAttribute("orientation", (event.target as HTMLInputElement).checked ? "vertical" : "horizontal")
  })
}

export { mount }
