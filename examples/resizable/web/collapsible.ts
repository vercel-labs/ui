import "@ui-sdk/web/resizable"
import { createElement, Folder, Search } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-resizable class="h-50 w-full max-w-md rounded-2xl border border-border">
      <ui-resizable-panel default-size="30" min-size="25" collapsible collapsed-size="56px" class="group flex flex-col gap-1 p-2 text-sm">
        <span class="flex h-8 items-center gap-2 rounded-xl bg-muted px-2.5 font-medium group-data-collapsed:justify-center group-data-collapsed:px-0">
          ${createElement(Folder, { class: "size-4 shrink-0", "aria-hidden": "true" }).outerHTML}
          <span class="truncate group-data-collapsed:hidden">Files</span>
        </span>
        <span class="flex h-8 items-center gap-2 rounded-xl px-2.5 text-muted-foreground group-data-collapsed:justify-center group-data-collapsed:px-0">
          ${createElement(Search, { class: "size-4 shrink-0", "aria-hidden": "true" }).outerHTML}
          <span class="truncate group-data-collapsed:hidden">Search</span>
        </span>
      </ui-resizable-panel>
      <ui-resizable-handle aria-label="Resize sidebar" class="relative flex w-px items-center justify-center bg-border outline-none focus-visible:ring-3 focus-visible:ring-ring/30 data-hovering:bg-ring data-dragging:bg-ring aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full [&[aria-orientation=horizontal]>div]:rotate-90"><div class="z-10 h-6 w-1 shrink-0 rounded-lg bg-border"></div></ui-resizable-handle>
      <ui-resizable-panel class="flex items-center justify-center p-6 text-sm font-medium">Editor</ui-resizable-panel>
    </ui-resizable>
  `
}

export { mount }
