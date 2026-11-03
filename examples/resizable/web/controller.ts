import "@ui-sdk/web/resizable"
import type { UiResizableElement } from "@ui-sdk/web"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-full max-w-md flex-col gap-3">
      <ui-resizable class="h-50 w-full rounded-2xl border border-border">
        <ui-resizable-panel id="controller-sidebar" default-size="30" min-size="20" collapsible class="flex items-center justify-center p-6 text-sm font-medium">Sidebar</ui-resizable-panel>
        <ui-resizable-handle aria-label="Resize sidebar" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full"></ui-resizable-handle>
        <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Editor</ui-resizable-panel>
      </ui-resizable>
      <div class="flex flex-wrap gap-2">
        <button type="button" data-action="collapse" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none">Collapse</button>
        <button type="button" data-action="expand" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none">Expand</button>
        <button type="button" data-action="resize" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none">240px</button>
        <button type="button" data-action="read" class="inline-flex h-8 shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground outline-none select-none transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:translate-y-px motion-reduce:transition-none motion-reduce:transform-none">Read</button>
      </div>
      <output class="text-sm text-muted-foreground tabular-nums" hidden></output>
    </div>
  `
  const group = root.querySelector<UiResizableElement>("ui-resizable")!
  const editor = group.api
  const reading = root.querySelector("output")!
  const actions: Record<string, () => void> = {
    collapse: () => editor.collapse("controller-sidebar"),
    expand: () => editor.expand("controller-sidebar"),
    resize: () => editor.resize("controller-sidebar", "240px"),
    read: () => {
      reading.textContent = `${editor.getLayout().map(Math.round).join(" / ")}${editor.isCollapsed(0) ? ", collapsed" : ""}`
      reading.hidden = false
    },
  }
  root.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", () => actions[button.dataset.action!]())
  })
}

export { mount }
