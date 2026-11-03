import "@ui-sdk/web/resizable"
import type { ResizableStorage } from "@ui-sdk/web"

const session: ResizableStorage = {
  getItem: (key) => sessionStorage.getItem(key),
  setItem: (key, value) => sessionStorage.setItem(key, value),
}

function mount(root: HTMLElement) {
  const group = document.createElement("ui-resizable") as HTMLElement & { storage?: ResizableStorage }
  group.storage = session
  group.setAttribute("auto-save-id", "docs-storage")
  group.innerHTML = `
    <ui-resizable-panel id="session-files" default-size="30">Files</ui-resizable-panel>
    <ui-resizable-handle aria-label="Resize files"></ui-resizable-handle>
    <ui-resizable-panel id="session-editor">Editor</ui-resizable-panel>
  `
  root.replaceChildren(group)
}

export { mount }
