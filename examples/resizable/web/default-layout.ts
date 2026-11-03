import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable default-layout="30,70" class="h-50 w-full max-w-md rounded-2xl border border-border">
      <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Files</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize files" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"></ui-resizable-handle>
      <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Editor</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
