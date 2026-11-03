import "@ui-sdk/web/resizable"
import type { UiResizableElement } from "@ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-full max-w-md flex-col gap-3">
      <ui-resizable default-layout="30,70" class="h-50 w-full rounded-2xl border border-border">
        <ui-resizable-panel min-size="20" class="flex items-center justify-center p-6 text-sm font-medium">Files</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize files" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"></ui-resizable-handle>
        <ui-resizable-panel min-size="20" class="flex items-center justify-center p-6 text-sm font-medium">Editor</ui-resizable-panel>
      </ui-resizable>
      <div class="flex flex-wrap gap-2">
        <button type="button" data-layout="20,80" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none">Narrow</button>
        <button type="button" data-layout="50,50" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none">Even</button>
      </div>
      <output class="text-sm text-muted-foreground tabular-nums">30 / 70</output>
    </div>
  `
  const group = root.querySelector<UiResizableElement>("ui-resizable")!
  const output = root.querySelector("output")!
  group.addEventListener("layoutchange", (event) => {
    output.textContent = event.detail.value.map(Math.round).join(" / ")
  })
  root.querySelectorAll<HTMLButtonElement>("[data-layout]").forEach((button) => {
    button.addEventListener("click", () => (group.layout = button.dataset.layout!.split(",").map(Number)))
  })
}

export { mount }
