import "@ui-sdk/web/tabs"
import { Archive, createElement, Mail, Reply } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-tabs default-value="inbox">
      <ui-tabs-list aria-label="Mail">
        <ui-tabs-tab value="inbox">
          <button type="button">
            <ui-tabs-tab-icon>${createElement(Mail, { "aria-hidden": "true" }).outerHTML}</ui-tabs-tab-icon>
            Inbox
          </button>
        </ui-tabs-tab>
        <ui-tabs-tab value="replies">
          <button type="button">
            <ui-tabs-tab-icon mirror>${createElement(Reply, { "aria-hidden": "true" }).outerHTML}</ui-tabs-tab-icon>
            Replies
          </button>
        </ui-tabs-tab>
        <ui-tabs-tab value="archive">
          <button type="button">
            <ui-tabs-tab-icon>${createElement(Archive, { "aria-hidden": "true" }).outerHTML}</ui-tabs-tab-icon>
            Archive
          </button>
        </ui-tabs-tab>
      </ui-tabs-list>
      <ui-tabs-panel value="inbox">Messages sent to you.</ui-tabs-panel>
      <ui-tabs-panel value="replies">Replies to your messages.</ui-tabs-panel>
      <ui-tabs-panel value="archive">Messages you put away.</ui-tabs-panel>
    </ui-tabs>
  `
}

export { mount }
