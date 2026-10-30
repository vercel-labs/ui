import { cn } from "cn"
import { html } from "lit-html"
import {
  href,
  labelOf,
  labels,
  people,
  personOf,
  priorities,
  statuses,
  type Issue,
  type IssuePatch,
  type Query,
} from "tracker-data"
import { icon } from "../lib/icons"
import { issueOf, updateIssues } from "../lib/tracker"
import {
  avatar,
  button,
  comboboxItem,
  comboboxTrigger,
  priorityIcon,
  selectItem,
  selectTrigger,
  statusIcon,
  styles,
  tooltip,
} from "../lib/ui"
import { issueActivity } from "./issue-activity"
import { subtasks } from "./subtasks"
import { onChange } from "../lib/view"

const calendarButton =
  "inline-flex size-8 shrink-0 cursor-default items-center justify-center rounded-2xl outline-none select-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 data-disabled:opacity-50 motion-reduce:transition-none [&_svg]:size-4"

function datePicker(issue: Issue, save: (patch: IssuePatch) => void) {
  return html`<ui-date-picker
    .value=${issue.due}
    @valuechange=${onChange(
      () => issueOf(issue.id)?.due ?? null,
      (due) => save({ due }),
    )}
    class="flex text-sm"
  >
    <div
      class="flex h-8 w-full items-center gap-0.5 rounded-2xl border border-transparent bg-input/50 ps-2.5 pe-1 transition-[color,box-shadow] duration-200 has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/30 motion-reduce:transition-none"
    >
      <ui-date-picker-input class="contents">
        <input
          class="h-full w-full min-w-0 bg-transparent text-base tabular-nums outline-none placeholder:text-muted-foreground md:text-sm"
        />
      </ui-date-picker-input>
      <ui-date-picker-trigger>
        <button
          aria-label="Choose date"
          class=${cn(calendarButton, "size-6 rounded-xl text-muted-foreground")}
        >
          ${icon("calendar")}
        </button>
      </ui-date-picker-trigger>
    </div>
    <ui-date-picker-content
      class="max-h-(--available-height) origin-(--transform-origin) overflow-y-auto rounded-3xl bg-popover p-3 text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-none transition-[opacity,scale] duration-100 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 motion-reduce:transition-none dark:ring-foreground/10"
    >
      <div class="flex items-center justify-between gap-2 pb-2">
        <ui-calendar-previous>
          <button aria-label="Previous month" class=${calendarButton}>
            ${icon("chevron-left", "rtl:rotate-180")}
          </button>
        </ui-calendar-previous>
        <ui-calendar-heading class="text-sm font-medium"></ui-calendar-heading>
        <ui-calendar-next>
          <button aria-label="Next month" class=${calendarButton}>
            ${icon("chevron-right", "rtl:rotate-180")}
          </button>
        </ui-calendar-next>
      </div>
      <ui-calendar-grid class="border-collapse">
        <ui-calendar-weekdays>
          <template>
            <ui-calendar-weekday
              class="size-8 text-center text-[0.8rem] font-normal text-muted-foreground"
            ></ui-calendar-weekday>
          </template>
        </ui-calendar-weekdays>
        <ui-calendar-weeks>
          <template>
            <ui-calendar-day
              class="size-8 cursor-default rounded-2xl text-center outline-none select-none transition-colors hover:bg-muted focus-visible:relative focus-visible:ring-3 focus-visible:ring-ring/30 data-today:bg-muted data-today:font-medium data-outside:text-muted-foreground data-disabled:opacity-50 data-selected:bg-primary data-selected:text-primary-foreground motion-reduce:transition-none"
            ></ui-calendar-day>
          </template>
        </ui-calendar-weeks>
      </ui-calendar-grid>
    </ui-date-picker-content>
  </ui-date-picker>`
}

function issueDetail(issue: Issue, query: Query) {
  const save = (patch: IssuePatch) => updateIssues([issue.id], patch)

  return html`<article aria-labelledby="issue-title" class="flex min-h-0 flex-1 flex-col">
    <div class="flex h-11 shrink-0 items-center gap-2 border-b border-border ps-4 pe-2">
      <span class="text-sm text-muted-foreground tabular-nums">${issue.id}</span>
      <span class="ms-auto">
        ${tooltip(
          html`<a
            href=${href(query, { issue: null })}
            aria-label="Close issue"
            class=${button({ variant: "ghost", size: "icon-sm" })}
            >${icon("x")}</a
          >`,
          "Close",
        )}
      </span>
    </div>
    <ui-scroll-area class="relative min-h-0 flex-1">
      <ui-scroll-area-viewport
        aria-label="Issue details"
        class="size-full rounded-[inherit] outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset"
      >
        <ui-scroll-area-content>
          <div class="grid gap-6 p-4">
            <h2 id="issue-title" class="sr-only">${issue.title}</h2>
            <ui-field name="title" class="grid gap-2">
              <ui-field-label class="sr-only">Title</ui-field-label>
              <input
                required
                .defaultValue=${issue.title}
                class=${cn(styles.control, "h-auto bg-transparent px-1.5 py-1 text-lg font-semibold md:text-lg")}
                @blur=${(event: FocusEvent) => {
                  const title = (event.currentTarget as HTMLInputElement).value.trim()
                  if (title && title !== issue.title) save({ title })
                }}
              />
            </ui-field>
            <ui-field name="description" class="grid gap-2">
              <ui-field-label class="sr-only">Description</ui-field-label>
              <textarea
                .defaultValue=${issue.description}
                placeholder="Add a description…"
                class=${cn(styles.control, "h-auto min-h-20 resize-none bg-transparent px-1.5 py-2")}
                @blur=${(event: FocusEvent) => {
                  const description = (event.currentTarget as HTMLTextAreaElement).value
                  if (description !== issue.description) save({ description })
                }}
              ></textarea>
            </ui-field>
            <div class="grid gap-4 sm:grid-cols-2">
              <ui-select
                .value=${issue.status}
                @valuechange=${onChange(
                  () => issueOf(issue.id)?.status ?? null,
                  (status) => status && save({ status }),
                )}
              >
                <div class="grid gap-2">
                  <ui-select-label class=${styles.label}>Status</ui-select-label>
                  ${selectTrigger({ icon: true })}
                </div>
                <ui-select-content class=${styles.list}>
                  ${statuses.map((status) => selectItem(status.value, status.label, statusIcon(status.value)))}
                </ui-select-content>
              </ui-select>
              <ui-combobox
                .value=${issue.assignee}
                .itemToLabel=${(id: string) => personOf(id)?.name ?? ""}
                @valuechange=${onChange(
                  () => issueOf(issue.id)?.assignee ?? null,
                  (assignee) => save({ assignee }),
                )}
              >
                <div class="grid gap-2">
                  <ui-combobox-label class=${styles.label}>Assignee</ui-combobox-label>
                  <div class="relative">
                    <ui-combobox-input
                      ><input placeholder="Nobody" class=${styles.comboboxInput}
                    /></ui-combobox-input>
                    ${comboboxTrigger("Show people")}
                  </div>
                </div>
                <ui-combobox-content class=${cn(styles.list, "w-(--anchor-width) min-w-44")}>
                  <ui-combobox-empty class=${styles.empty}>Nobody matches.</ui-combobox-empty>
                  <ui-combobox-list>
                    ${people.map((person) =>
                      comboboxItem(
                        person.id,
                        person.name,
                        html`${avatar(person.name, { size: "sm", decorative: true })} ${person.name}`,
                      ),
                    )}
                  </ui-combobox-list>
                </ui-combobox-content>
              </ui-combobox>
              <ui-field class="grid gap-2">
                <ui-field-label class=${styles.label}>Due date</ui-field-label>
                ${datePicker(issue, save)}
              </ui-field>
              <ui-combobox
                multiple
                .value=${issue.labels}
                .itemToLabel=${(id: string) => labelOf(id)?.name ?? id}
                @valuechange=${onChange(
                  () => issueOf(issue.id)?.labels ?? [],
                  (labels) => save({ labels }),
                )}
              >
                <div class="grid gap-2">
                  <ui-combobox-label class=${styles.label}>Labels</ui-combobox-label>
                  <ui-combobox-chips class=${styles.chips}>
                    <ui-combobox-input>
                      <input
                        placeholder=${issue.labels.length ? "" : "Add a label"}
                        class="h-6 min-w-8 flex-1 bg-transparent px-1.5 text-base outline-none placeholder:text-muted-foreground md:text-sm"
                      />
                    </ui-combobox-input>
                    ${comboboxTrigger("Show labels")}
                  </ui-combobox-chips>
                </div>
                <ui-combobox-content class=${cn(styles.list, "w-(--anchor-width) min-w-44")}>
                  <ui-combobox-empty class=${styles.empty}>No labels match.</ui-combobox-empty>
                  <ui-combobox-list>
                    ${labels.map((label) =>
                      comboboxItem(
                        label.id,
                        label.name,
                        html`<span class="size-2 rounded-full" style="background: ${label.color}"></span>
                          ${label.name}`,
                      ),
                    )}
                  </ui-combobox-list>
                </ui-combobox-content>
                <template>
                  <ui-combobox-chip
                    class="flex h-5.5 w-fit items-center gap-1 rounded-2xl bg-input ps-1.5 pe-0.5 text-xs font-medium whitespace-nowrap outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                  >
                    <ui-combobox-chip-remove>
                      <button
                        type="button"
                        class="-ms-0.5 flex size-4.5 cursor-default items-center justify-center rounded-full opacity-50 outline-none hover:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/30"
                      >
                        ×
                      </button>
                    </ui-combobox-chip-remove>
                  </ui-combobox-chip>
                </template>
              </ui-combobox>
            </div>
            <ui-radio-group
              aria-labelledby="priority-label"
              .value=${issue.priority}
              @valuechange=${onChange(
                () => issueOf(issue.id)?.priority ?? null,
                (priority) => priority && save({ priority }),
              )}
              class="grid gap-2"
            >
              <span id="priority-label" class="text-sm leading-none font-medium">Priority</span>
              <div class="flex flex-wrap gap-x-4 gap-y-2">
                ${priorities.map(
                  (priority) =>
                    html`<label class="flex items-center gap-2">
                      <ui-radio value=${priority.value} class=${styles.radio}>
                        <ui-radio-indicator
                          class="size-1.5 rounded-full bg-primary-foreground"
                        ></ui-radio-indicator>
                      </ui-radio>
                      ${priorityIcon(priority.value)} ${priority.label}
                    </label>`,
                )}
              </div>
            </ui-radio-group>
            ${subtasks(issue)} ${issueActivity(issue)}
          </div>
        </ui-scroll-area-content>
      </ui-scroll-area-viewport>
      <ui-scroll-area-scrollbar
        class="flex w-2.5 p-px opacity-0 transition-opacity duration-150 data-visible:opacity-100 motion-reduce:transition-none"
      >
        <ui-scroll-area-thumb class="relative flex-1 rounded-full bg-border"></ui-scroll-area-thumb>
      </ui-scroll-area-scrollbar>
    </ui-scroll-area>
  </article>`
}

export { issueDetail }
