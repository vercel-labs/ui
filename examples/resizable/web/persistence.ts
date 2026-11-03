import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable auto-save-id="docs-persistence" class="h-50 w-full max-w-md rounded-2xl border border-border">
      <ui-resizable-panel id="docs-sidebar" default-size="30" min-size="20" class="flex items-center justify-center p-6 text-sm font-medium">Sidebar</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize sidebar" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"><div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div></ui-resizable-handle>
      <ui-resizable-panel id="docs-content" class="flex items-center justify-center p-6 text-sm font-medium">Content</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
