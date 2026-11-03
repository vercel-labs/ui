import "@ui-sdk/web/tabs"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="reply">
      <ui-tabs-list aria-label="Comment">
        <ui-tabs-tab value="reply">
          <button type="button">Reply</button>
        </ui-tabs-tab>
        <ui-tabs-tab value="formatting">
          <button type="button">Formatting</button>
        </ui-tabs-tab>
        <ui-tabs-indicator></ui-tabs-indicator>
      </ui-tabs-list>
      <ui-tabs-panel value="reply" keep-mounted>
        <textarea aria-label="Reply" placeholder="Write a reply…"></textarea>
      </ui-tabs-panel>
      <ui-tabs-panel value="formatting">
        Use **bold**, _italics_ and \`code\`. Paste a link to embed it.
      </ui-tabs-panel>
    </ui-tabs>
  `
}

export { mount }
