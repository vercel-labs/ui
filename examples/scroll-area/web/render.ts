import "@ui-sdk/web/scroll-area"

const tags = Array.from({ length: 50 }, (_, index) => `v1.2.0-beta.${50 - index}`)

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-scroll-area class="group h-72 w-56 rounded-2xl border border-border">
      <ui-scroll-area-viewport role="region" aria-label="Releases" class="size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none">
        <ui-scroll-area-content class="p-4 pb-10 text-sm">
          ${tags.map((tag) => `<p class="py-1.5">${tag}</p>`).join("")}
        </ui-scroll-area-content>
      </ui-scroll-area-viewport>
      <p aria-hidden="true" class="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-2xl bg-background/90 py-2 text-center text-xs text-muted-foreground group-data-at-end:hidden">
        <span class="hidden group-data-at-start:inline">Scroll for older releases</span>
        <span class="group-data-at-start:hidden">Keep going</span>
      </p>
      <ui-scroll-area-scrollbar class="flex w-2 border-s border-s-transparent p-px opacity-0 transition-[opacity,width] data-dragging:opacity-100 data-scrolling:w-2.5 data-visible:opacity-100 data-hovering:w-2.5 motion-reduce:transition-none">
        <ui-scroll-area-thumb class="relative flex-1 rounded-full bg-border data-dragging:bg-muted-foreground"></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
    </ui-scroll-area>
  `
}

export { mount }
