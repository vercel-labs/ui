import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable class="h-50 w-full max-w-md rounded-2xl border border-border transition-colors data-dragging:bg-muted/50 motion-reduce:transition-none">
      <ui-resizable-panel default-size="35" min-size="20" collapsible class="group flex flex-col items-center justify-center gap-1 p-6 text-sm font-medium">
        <span>Files</span>
        <span data-size class="text-xs text-muted-foreground tabular-nums group-data-collapsed:hidden">35%</span>
        <span class="hidden text-xs text-muted-foreground tabular-nums group-data-collapsed:inline">Collapsed</span>
      </ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize files" class="w-1 bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-primary"></ui-resizable-handle>
      <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Editor, horizontal</ui-resizable-panel>
    </ui-resizable>
  `
  const size = root.querySelector<HTMLElement>("[data-size]")!
  root.querySelector("ui-resizable")!.addEventListener("layoutchange", (event) => {
    size.textContent = `${Math.round(event.detail.value[0])}%`
  })
}

export { mount }
