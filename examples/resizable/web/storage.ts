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
  group.className = "h-50 w-full max-w-md rounded-2xl border border-border"
  group.innerHTML = `
    <ui-resizable-panel id="session-files" default-size="30" class="flex items-center justify-center p-6 text-sm font-medium">Files</ui-resizable-panel>
    <ui-resizable-handle aria-label="Resize files" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"></ui-resizable-handle>
    <ui-resizable-panel id="session-editor" class="flex items-center justify-center p-6 text-sm font-medium">Editor</ui-resizable-panel>
  `
  root.replaceChildren(group)
}

export { mount }
