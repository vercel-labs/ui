import "@ui-sdk/web/pagination"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-pagination aria-label="Pagination" page-count="5">
      <ui-pagination-list>
        ${[1, 2, 3, 4, 5]
          .map(
            (page) => `
              <ui-pagination-item>
                <ui-pagination-link page="${page}">
                  <button data-variant="ghost">${page}</button>
                </ui-pagination-link>
              </ui-pagination-item>`,
          )
          .join("")}
      </ui-pagination-list>
    </ui-pagination>
  `
}

export { mount }
