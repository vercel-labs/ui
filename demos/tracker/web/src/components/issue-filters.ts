import { cn } from "cn"
import { html } from "lit-html"
import { people, personOf, priorities, type Query } from "tracker-data"
import {
  avatar,
  comboboxItem,
  comboboxTrigger,
  selectItem,
  selectTrigger,
  styles,
} from "../lib/ui"
import { query as currentQuery } from "../lib/router"
import { onChange } from "../lib/view"

const priorityItems = [{ value: "any", label: "Any priority" }, ...priorities]

function issueFilters(
  query: Query,
  change: (patch: Partial<Query>) => void,
  { stacked = false } = {}
) {
  const label = stacked ? styles.label : "sr-only"
  return html`<div class=${stacked ? "grid gap-4" : "flex items-center gap-2"}>
    <ui-select
      .value=${query.priority ?? "any"}
      @valuechange=${onChange(
        () => currentQuery().priority ?? "any",
        (priority) =>
          change({ priority: priority === "any" ? null : priority, page: 1 })
      )}
    >
      <div class="grid gap-2">
        <ui-select-label class=${label}
          >${stacked ? "Priority" : "Filter by priority"}</ui-select-label
        >
        ${selectTrigger({ className: stacked ? "" : "w-36" })}
      </div>
      <ui-select-content class=${styles.list}>
        ${priorityItems.map((priority) => selectItem(priority.value, priority.label))}
      </ui-select-content>
    </ui-select>
    <ui-combobox
      .value=${query.assignee}
      .itemToLabel=${(id: string) => personOf(id)?.name ?? ""}
      @valuechange=${onChange(
        () => currentQuery().assignee,
        (assignee) => change({ assignee, page: 1 })
      )}
    >
      <div class="grid gap-2">
        <ui-combobox-label class=${label}
          >${stacked ? "Assignee" : "Filter by assignee"}</ui-combobox-label
        >
        <div class=${stacked ? "relative" : "relative w-40"}>
          <ui-combobox-input
            ><input placeholder="Anyone" class=${styles.comboboxInput}
          /></ui-combobox-input>
          ${comboboxTrigger("Show people")}
        </div>
      </div>
      <ui-combobox-content
        class=${cn(styles.list, "w-(--anchor-width) min-w-44")}
      >
        <ui-combobox-empty class=${styles.empty}
          >Nobody matches.</ui-combobox-empty
        >
        <ui-combobox-list>
          ${people.map((person) =>
            comboboxItem(
              person.id,
              person.name,
              html`${avatar(person.name, { size: "sm", decorative: true })}
              ${person.name}`
            )
          )}
        </ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>
  </div>`
}

export { issueFilters }
