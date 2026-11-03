import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable orientation="vertical" class="h-50 w-full max-w-md rounded-2xl border border-border">
      <ui-resizable-panel default-size="25" class="flex items-center justify-center p-6 text-sm font-medium">Header</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize header" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"></ui-resizable-handle>
      <ui-resizable-panel default-size="75" class="flex items-center justify-center p-6 text-sm font-medium">Content</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
