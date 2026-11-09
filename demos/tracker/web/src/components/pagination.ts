import { html } from "lit-html"
import { unsafeHTML } from "lit-html/directives/unsafe-html.js"
import { icon, iconMarkup } from "../lib/icons"

const step =
  "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl border border-transparent text-sm font-medium text-foreground outline-none select-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30 not-data-disabled:hover:bg-muted data-disabled:opacity-50 data-current:border-border data-current:bg-background motion-reduce:transition-none"

const templates = `<template>
  <ui-pagination-item><ui-pagination-link><a class="${step}"></a></ui-pagination-link></ui-pagination-item>
</template>
<template data-ellipsis>
  <ui-pagination-item>
    <ui-pagination-ellipsis class="flex size-8 items-center justify-center text-muted-foreground">${iconMarkup("ellipsis")}</ui-pagination-ellipsis>
  </ui-pagination-item>
</template>`

function pagination(
  page: number,
  pageCount: number,
  getHref: (page: number) => string
) {
  return html`<ui-pagination
    aria-label="Pages"
    .page=${page}
    page-count=${pageCount}
    .getHref=${getHref}
  >
    <ui-pagination-list class="flex items-center gap-1">
      <ui-pagination-item>
        <ui-pagination-previous>
          <a class=${step}
            >${icon("chevron-left", "size-4 rtl:rotate-180")}<span
              class="sr-only"
              >Previous</span
            ></a
          >
        </ui-pagination-previous>
      </ui-pagination-item>
      ${unsafeHTML(templates)}
      <ui-pagination-item>
        <ui-pagination-next>
          <a class=${step}
            ><span class="sr-only">Next</span
            >${icon("chevron-right", "size-4 rtl:rotate-180")}</a
          >
        </ui-pagination-next>
      </ui-pagination-item>
    </ui-pagination-list>
  </ui-pagination>`
}

export { pagination }
