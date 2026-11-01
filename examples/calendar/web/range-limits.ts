import "@ui-sdk/web/calendar"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-calendar mode="range" min-days="3" max-days="8" unavailable="2026-10-17,2026-10-18" allow-unavailable class="min-h-72 w-fit max-w-full rounded-3xl border border-border bg-background p-3 text-sm leading-5 text-foreground">
      <div class="flex h-10 items-center justify-between gap-2 pb-2">
        <ui-calendar-previous>
          <button class="inline-flex size-8 cursor-default shrink-0 items-center justify-center rounded-2xl border border-transparent bg-transparent p-0 outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50">
            ${createElement(ChevronLeft, { class: "pointer-events-none block size-4 shrink-0 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-calendar-previous>
        <ui-calendar-heading class="m-0 text-sm leading-5 font-medium"></ui-calendar-heading>
        <ui-calendar-next>
          <button class="inline-flex size-8 cursor-default shrink-0 items-center justify-center rounded-2xl border border-transparent bg-transparent p-0 outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50">
            ${createElement(ChevronRight, { class: "pointer-events-none block size-4 shrink-0 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-calendar-next>
      </div>
      <ui-calendar-grid class="border-collapse">
        <ui-calendar-weekdays>
          <template><ui-calendar-weekday class="size-8 p-0 text-center align-middle text-[0.8rem] leading-5 font-normal text-muted-foreground"></ui-calendar-weekday></template>
        </ui-calendar-weekdays>
        <ui-calendar-weeks>
          <template><ui-calendar-day class="size-8 cursor-default rounded-2xl p-0 text-center align-middle text-sm leading-5 outline-none select-none focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/30 data-range-start:bg-primary data-range-start:text-primary-foreground data-range-end:bg-primary data-range-end:text-primary-foreground data-range-middle:rounded-none data-range-middle:bg-muted not-data-selected:hover:bg-muted not-data-selected:data-unavailable:text-muted-foreground not-data-selected:data-unavailable:line-through data-disabled:text-muted-foreground data-disabled:opacity-50"></ui-calendar-day></template>
        </ui-calendar-weeks>
      </ui-calendar-grid>
    </ui-calendar>
  `
}

export { mount }
