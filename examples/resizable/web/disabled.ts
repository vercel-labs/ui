import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-full max-w-md flex-col gap-3">
      <ui-resizable class="h-50 w-full rounded-2xl border border-border data-disabled:opacity-50">
        <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Fixed</ui-resizable-panel>
        <ui-resizable-handle disabled aria-label="Resize fixed" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full data-disabled:opacity-50"></ui-resizable-handle>
        <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Two</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize two" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full data-disabled:opacity-50"></ui-resizable-handle>
        <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Three</ui-resizable-panel>
      </ui-resizable>
      <label class="flex w-fit items-center gap-2 text-sm">
        <input type="checkbox" class="size-4 accent-primary" />
        Disable the group
      </label>
    </div>
  `
  const group = root.querySelector("ui-resizable")!
  const toggle = root.querySelector<HTMLInputElement>("input")!
  toggle.addEventListener("change", () => group.toggleAttribute("disabled", toggle.checked))
}

export { mount }
