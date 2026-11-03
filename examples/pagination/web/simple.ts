import "@ui-sdk/web/pagination"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-pagination aria-label="Pagination" page-count="5">
      <ui-pagination-list class="flex flex-wrap items-center justify-center gap-1">
        ${[1, 2, 3, 4, 5]
          .map(
            (page) => `
              <ui-pagination-item>
                <ui-pagination-link page="${page}">
                  <button class="inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium whitespace-nowrap text-foreground select-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 motion-reduce:transition-none hover:bg-muted data-current:border-border data-current:bg-background">${page}</button>
                </ui-pagination-link>
              </ui-pagination-item>`,
          )
          .join("")}
      </ui-pagination-list>
    </ui-pagination>
  `
}

export { mount }
