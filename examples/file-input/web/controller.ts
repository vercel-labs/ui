import { createFileInputController } from "@ui-sdk/web/file-input"
import { createElement, File as FileIcon, X } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex w-full max-w-md min-w-0 flex-col gap-3 text-foreground">
      <div class="flex flex-wrap gap-2">
        <button type="button" data-action="open" class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none data-disabled:pointer-events-none data-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50 data-invalid:border-foreground/50 data-invalid:ring-3 data-invalid:ring-foreground/10">Open the picker</button>
        <button type="button" data-action="add" class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none data-disabled:pointer-events-none data-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50 data-invalid:border-foreground/50 data-invalid:ring-3 data-invalid:ring-foreground/10">Add a note</button>
        <button type="button" data-action="clear" class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-transparent bg-secondary bg-clip-padding px-3 text-sm font-medium whitespace-nowrap text-secondary-foreground transition-all outline-none select-none hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 active:enabled:translate-y-px motion-reduce:transition-none data-disabled:pointer-events-none data-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50 data-invalid:border-foreground/50 data-invalid:ring-3 data-invalid:ring-foreground/10">Clear</button>
      </div>
      <ui-file-input multiple class="contents">
        <ui-file-input-list aria-label="Files" class="flex h-40 min-w-0 flex-col gap-2 overflow-y-auto p-1">
          <template>
            <ui-file-input-item class="flex shrink-0 items-center gap-3 rounded-2xl border border-border py-1.5 ps-3 pe-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30">
              ${createElement(FileIcon, { class: "size-4 shrink-0 text-muted-foreground", "aria-hidden": "true" }).outerHTML}
              <span data-file="name" class="min-w-0 flex-1 truncate"></span>
              <span data-file="size" class="shrink-0 text-xs text-muted-foreground"></span>
              <ui-file-input-item-remove><button type="button" class="inline-flex size-6 shrink-0 cursor-default items-center justify-center rounded-xl border-0 bg-transparent p-0 text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none data-disabled:pointer-events-none data-disabled:opacity-50">${createElement(X, { class: "size-3.5", "aria-hidden": "true" }).outerHTML}</button></ui-file-input-item-remove>
            </ui-file-input-item>
          </template>
        </ui-file-input-list>
      </ui-file-input>
    </div>
  `
  const controller = createFileInputController()
  root.querySelector("ui-file-input")!.controller = controller

  root.querySelector('[data-action="open"]')!.addEventListener("click", () => controller.open())
  root
    .querySelector('[data-action="add"]')!
    .addEventListener("click", () =>
      controller.addFiles([new File(["hello"], `note-${Date.now()}.txt`, { type: "text/plain" })]),
    )
  root.querySelector('[data-action="clear"]')!.addEventListener("click", () => controller.clear())
}
