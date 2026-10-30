import { createDatePickerController } from "@ui-sdk/web/date-picker"
import { Calendar, ChevronLeft, ChevronRight, createElement } from "lucide"

export function mount(root: HTMLElement) {
  root.innerHTML = `
    <ui-date-picker default-value="2026-10-16" class="flex flex-col gap-2 data-disabled:opacity-50">
      <div class="flex h-8 w-44 items-center gap-0.5 rounded-2xl border border-transparent bg-input/50 pr-1 pl-2.5 transition-[color,box-shadow] duration-200 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30 has-[input[aria-invalid]]:border-destructive">
        <ui-date-picker-input><input aria-label="Due date" class="h-full w-full min-w-0 bg-transparent text-base tabular-nums outline-none placeholder:text-muted-foreground md:text-sm" /></ui-date-picker-input>
        <ui-date-picker-trigger>
          <button class="flex size-6 shrink-0 items-center justify-center rounded-xl text-muted-foreground outline-none select-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none dark:hover:bg-muted/50">
            ${createElement(Calendar, { class: "size-4", "aria-hidden": "true" }).outerHTML}
          </button>
        </ui-date-picker-trigger>
      </div>
      <ui-date-picker-hint class="text-sm text-muted-foreground"></ui-date-picker-hint>
      <ui-date-picker-content class="flex origin-(--transform-origin) flex-col rounded-3xl bg-popover p-3 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 dark:ring-foreground/10">
        <div class="flex h-8 items-center justify-between gap-2 pb-2">
          <ui-calendar-previous>
            <button class="inline-flex size-7 shrink-0 items-center justify-center rounded-2xl border border-transparent outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50 dark:hover:bg-muted/50">
              ${createElement(ChevronLeft, { class: "size-4 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-calendar-previous>
          <ui-calendar-heading class="text-sm font-medium"></ui-calendar-heading>
          <ui-calendar-next>
            <button class="inline-flex size-7 shrink-0 items-center justify-center rounded-2xl border border-transparent outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50 dark:hover:bg-muted/50">
              ${createElement(ChevronRight, { class: "size-4 rtl:rotate-180", "aria-hidden": "true" }).outerHTML}
            </button>
          </ui-calendar-next>
        </div>
        <ui-calendar-grid class="border-collapse">
          <ui-calendar-weekdays>
            <template><ui-calendar-weekday class="size-8 p-0 text-center align-middle text-[0.8rem] font-normal text-muted-foreground"></ui-calendar-weekday></template>
          </ui-calendar-weekdays>
          <ui-calendar-weeks>
            <template><ui-calendar-day class="size-8 rounded-xl p-0 text-center align-middle text-sm outline-none select-none transition-[color,background-color,box-shadow] hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-today:bg-muted data-today:font-medium data-outside:text-muted-foreground data-disabled:text-muted-foreground data-disabled:opacity-50 data-unavailable:line-through data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary/90 dark:hover:bg-muted/50"></ui-calendar-day></template>
          </ui-calendar-weeks>
        </ui-calendar-grid>
      </ui-date-picker-content>
      <div class="flex gap-1">
        <button type="button" data-action="christmas" class="inline-flex h-7 items-center justify-center rounded-xl px-2.5 text-sm outline-none select-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:bg-muted data-selected:font-medium dark:hover:bg-muted/50">Christmas</button>
        <button type="button" data-action="open" class="inline-flex h-7 items-center justify-center rounded-xl px-2.5 text-sm outline-none select-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-selected:bg-muted data-selected:font-medium dark:hover:bg-muted/50">Open</button>
      </div>
    </ui-date-picker>
  `
  const controller = createDatePickerController()
  root.querySelector("ui-date-picker")!.controller = controller
  root
    .querySelector('[data-action="christmas"]')!
    .addEventListener("click", () => controller.setValue("2026-12-25"))
  root.querySelector('[data-action="open"]')!.addEventListener("click", () => controller.open())
}
