import "@ui-sdk/web/tabs"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div data-slot="stack">
      <ui-tabs default-value="inbox">
        <ui-tabs-list aria-label="Mail">
          <ui-tabs-tab value="inbox">
            <button type="button">Inbox</button>
          </ui-tabs-tab>
          <ui-tabs-tab value="drafts">
            <button type="button">Drafts</button>
          </ui-tabs-tab>
          <ui-tabs-tab value="sent">
            <button type="button">Sent</button>
          </ui-tabs-tab>
          <ui-tabs-indicator></ui-tabs-indicator>
        </ui-tabs-list>
        <ui-tabs-panel value="inbox">No new mail.</ui-tabs-panel>
        <ui-tabs-panel value="drafts">Two drafts.</ui-tabs-panel>
        <ui-tabs-panel value="sent">Sent this week: 12.</ui-tabs-panel>
      </ui-tabs>
      <div data-slot="row">
        <button type="button">Show sent mail</button>
      </div>
      <output data-slot="output">Selected: inbox</output>
    </div>
  `
  const tabs = root.querySelector("ui-tabs") as HTMLElement & { api: { select: (value: string) => void } }
  root.querySelector("ui-tabs + div button")!.addEventListener("click", () => tabs.api.select("sent"))
  tabs.addEventListener("valuechange", (event) => {
    const { value, reason } = (event as CustomEvent<{ value: string; reason: string }>).detail
    root.querySelector("output")!.textContent = `Selected: ${value}, last change: ${reason}`
  })
}

export { mount }
