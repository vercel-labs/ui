import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable class="h-50 w-full max-w-md rounded-2xl border border-border">
      <ui-resizable-panel default-size="200px" min-size="160px" max-size="320px" class="flex items-center justify-center p-6 text-sm font-medium">Navigation</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize navigation" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"><div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div></ui-resizable-handle>
      <ui-resizable-panel min-size="30" class="flex items-center justify-center p-6 text-sm font-medium">Content</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
