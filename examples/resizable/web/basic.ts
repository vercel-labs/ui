import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable class="h-50 w-full max-w-md rounded-2xl border border-border">
      <ui-resizable-panel default-size="50" class="flex items-center justify-center p-6 text-sm font-medium">One</ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize one" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"></ui-resizable-handle>
      <ui-resizable-panel default-size="50">
        <ui-resizable orientation="vertical" class="h-full">
          <ui-resizable-panel default-size="25" class="flex items-center justify-center p-6 text-sm font-medium">Two</ui-resizable-panel>
          <ui-resizable-handle aria-label="Resize two" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"></ui-resizable-handle>
          <ui-resizable-panel default-size="75" class="flex items-center justify-center p-6 text-sm font-medium">Three</ui-resizable-panel>
        </ui-resizable>
      </ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
