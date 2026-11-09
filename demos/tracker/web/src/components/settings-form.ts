import { toast } from "@ui-sdk/web"
import { html } from "lit-html"
import { readSettings, type Settings } from "tracker-data"
import { icon } from "../lib/icons"
import { saveSettings } from "../lib/tracker"
import { button, styles } from "../lib/ui"

const step =
  "inline-flex size-6 shrink-0 cursor-default items-center justify-center rounded-xl text-muted-foreground outline-none select-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:pointer-events-none data-disabled:opacity-50 motion-reduce:transition-none"

function submit(event: SubmitEvent) {
  event.preventDefault()
  saveSettings(
    readSettings(
      Object.fromEntries(new FormData(event.currentTarget as HTMLFormElement))
    )
  )
  toast.success("Settings saved")
}

function settingsForm(settings: Settings) {
  return html`<form @submit=${submit} class="grid gap-8">
    <ui-field class="flex min-w-0 flex-row items-center justify-between gap-6">
      <div class="grid gap-1.5">
        <ui-field-label class=${styles.label}
          >Email notifications</ui-field-label
        >
        <ui-field-description class=${styles.description}>
          Get an email when someone mentions you or assigns you an issue.
        </ui-field-description>
      </div>
      <ui-switch
        name="emailNotifications"
        ?default-checked=${settings.emailNotifications}
        class="relative inline-flex h-5 w-8 shrink-0 cursor-default items-center rounded-2xl border-2 border-transparent bg-input/90 outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:ring-3 focus-visible:ring-ring/30 data-checked:bg-primary data-disabled:opacity-50 motion-reduce:transition-none"
      >
        <ui-switch-thumb
          class="pointer-events-none block size-4 rounded-2xl bg-background shadow-sm transition-transform data-checked:translate-x-[calc(100%-4px)] rtl:data-checked:-translate-x-[calc(100%-4px)] motion-reduce:transition-none"
        ></ui-switch-thumb>
      </ui-switch>
    </ui-field>
    <ui-field class="flex min-w-0 flex-col gap-2">
      <ui-field-label class=${styles.label}>Issues per page</ui-field-label>
      <ui-number-input
        name="pageSize"
        default-value=${settings.pageSize}
        min="5"
        max="50"
        step="5"
      >
        <ui-number-input-group
          class="flex h-8 w-32 items-center gap-0.5 rounded-2xl border border-transparent bg-input/50 px-1 transition-[color,box-shadow] duration-200 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30 motion-reduce:transition-none"
        >
          <ui-number-input-decrement
            ><button aria-label="Decrease" class=${step}>
              ${icon("minus")}
            </button></ui-number-input-decrement
          >
          <ui-number-input-control class="contents">
            <input
              class="h-full w-full min-w-0 bg-transparent text-center text-base tabular-nums outline-none md:text-sm"
            />
          </ui-number-input-control>
          <ui-number-input-increment
            ><button aria-label="Increase" class=${step}>
              ${icon("plus")}
            </button></ui-number-input-increment
          >
        </ui-number-input-group>
      </ui-number-input>
      <ui-field-description class=${styles.description}>
        How many issues the list shows before it splits into pages.
      </ui-field-description>
    </ui-field>
    <ui-field class="flex min-w-0 flex-col gap-2">
      <ui-slider
        name="autoCloseDays"
        default-value=${settings.autoCloseDays}
        min="7"
        max="90"
        step="1"
        .format=${{ style: "unit", unit: "day", unitDisplay: "long" }}
        class="flex flex-col gap-2"
      >
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-1">
            <ui-field-label class=${styles.label}
              >Close stale issues after</ui-field-label
            >
            <ui-popover>
              <ui-popover-trigger>
                <button
                  aria-label="About stale issues"
                  class=${button({ variant: "ghost", size: "icon-sm" })}
                >
                  ${icon("info")}
                </button>
              </ui-popover-trigger>
              <ui-popover-content side-offset="8" class=${styles.popover}>
                <ui-popover-title class="font-medium"
                  >Stale issues</ui-popover-title
                >
                <ui-popover-description class="text-muted-foreground">
                  An open issue with no comments or changes for this long moves
                  to Canceled. Its assignee gets an email first.
                </ui-popover-description>
              </ui-popover-content>
            </ui-popover>
          </span>
          <ui-slider-value
            class="text-muted-foreground tabular-nums"
          ></ui-slider-value>
        </div>
        <ui-slider-control
          class="flex w-full items-center py-2 select-none data-disabled:opacity-50"
        >
          <ui-slider-track class="block h-1 w-full rounded-2xl bg-input/90">
            <ui-slider-indicator
              class="block rounded-2xl bg-primary"
            ></ui-slider-indicator>
            <ui-slider-thumb
              class="block size-4 shrink-0 cursor-default rounded-2xl bg-white shadow-md ring-1 ring-black/10 transition-shadow duration-200 hover:ring-4 hover:ring-ring/30 has-focus-visible:ring-4 has-focus-visible:ring-ring/30 data-dragging:ring-4 data-dragging:ring-ring/30 motion-reduce:transition-none"
            ></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
    </ui-field>
    <div class="flex justify-end">
      <button type="submit" class=${button({ variant: "primary" })}>
        Save changes
      </button>
    </div>
  </form>`
}

export { settingsForm }
