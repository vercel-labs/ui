import { createCalendarController } from "@ui-sdk/web/calendar"
import { ChevronLeft, ChevronRight, createElement } from "lucide"

function mount(root: HTMLElement) {
  root.innerHTML = `
    <div class="flex max-w-full flex-col items-start gap-3">
      <div class="flex flex-wrap gap-2">
        <button type="button" data-action="christmas" class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm leading-5 font-medium whitespace-nowrap text-foreground transition-all select-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 hover:bg-muted hover:text-foreground active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50">Go to Christmas</button>
        <button type="button" data-action="clear" class="inline-flex h-8 w-fit shrink-0 cursor-default items-center justify-center gap-1.5 rounded-2xl border border-border bg-background bg-clip-padding px-3 text-sm leading-5 font-medium whitespace-nowrap text-foreground transition-all select-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 hover:bg-muted hover:text-foreground active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50">Clear</button>
      </div>
      <ui-calendar default-value="2026-10-16" default-month="2026-10" class="min-h-72 w-fit max-w-full rounded-3xl border border-border bg-background p-3 text-sm leading-5 text-foreground">
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
            <template><ui-calendar-day class="size-8 cursor-default rounded-2xl p-0 text-center align-middle text-sm leading-5 outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:relative focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/30 data-today:bg-muted data-today:font-medium data-outside:text-muted-foreground data-disabled:text-muted-foreground data-disabled:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary/90"></ui-calendar-day></template>
          </ui-calendar-weeks>
        </ui-calendar-grid>
      </ui-calendar>
    </div>
  `
  const calendar = createCalendarController()
  root.querySelector("ui-calendar")!.controller = calendar
  root
    .querySelector('[data-action="christmas"]')!
    .addEventListener("click", () => calendar.focus("2026-12-25"))
  root.querySelector('[data-action="clear"]')!.addEventListener("click", () => calendar.setValue(null))
}

export { mount }
