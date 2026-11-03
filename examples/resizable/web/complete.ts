import "@ui-sdk/web/resizable"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-full max-w-md flex-col gap-3">
      <ui-resizable class="h-50 w-full rounded-2xl border border-border">
        <ui-resizable-panel default-size="40" class="flex items-center justify-center p-6 text-sm font-medium">Files</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize files" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"></ui-resizable-handle>
        <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Editor</ui-resizable-panel>
      </ui-resizable>
      <output class="text-sm text-muted-foreground tabular-nums">0 changes, saved nothing yet</output>
    </div>
  `
  const group = root.querySelector("ui-resizable")!
  const output = root.querySelector("output")!
  let moves = 0
  let saved = "nothing yet"
  const show = () => (output.textContent = `${moves} changes, saved ${saved}`)
  group.addEventListener("layoutchange", () => {
    moves++
    show()
  })
  group.addEventListener("layoutcommit", (event) => {
    saved = `${event.detail.value.map(Math.round).join(" / ")} after ${event.detail.reason}`
    show()
  })
}

export { mount }
