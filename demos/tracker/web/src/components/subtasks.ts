import type { TreeItemData } from "@ui-sdk/core/tree"
import { html, nothing } from "lit-html"
import { leaves, type Issue, type Subtask } from "tracker-data"
import { issueOf, setSubtasksDone } from "../lib/tracker"
import { onChange } from "../lib/view"

function toItems(subtasks: Subtask[]): TreeItemData[] {
  return subtasks.map((subtask) => ({
    value: subtask.id,
    label: subtask.title,
    children: subtask.subtasks && toItems(subtask.subtasks),
  }))
}

const trees = new WeakMap<Subtask[], TreeItemData[]>()

function itemsOf(subtasks: Subtask[]) {
  let items = trees.get(subtasks)
  if (!items) {
    trees.set(subtasks, (items = toItems(subtasks)))
  }
  return items
}

function doneOf(subtasks: Subtask[]) {
  return leaves(subtasks)
    .filter((subtask) => subtask.done)
    .map((subtask) => subtask.id)
}

function subtasks(issue: Issue) {
  const all = leaves(issue.subtasks)
  if (all.length === 0) {
    return nothing
  }
  const checked = doneOf(issue.subtasks)
  const expanded = issue.subtasks
    .filter((subtask) => subtask.subtasks)
    .map((subtask) => subtask.id)

  return html`<section aria-labelledby="subtasks-label" class="grid gap-3">
    <h3 id="subtasks-label" class="text-sm font-medium">Subtasks</h3>
    <ui-progress
      value=${checked.length}
      max=${all.length}
      .format=${(value: number) => `${value} of ${all.length}`}
      class="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5"
    >
      <ui-progress-label class="text-xs font-medium text-muted-foreground"
        >Done</ui-progress-label
      >
      <ui-progress-value
        class="ms-auto text-xs text-muted-foreground tabular-nums"
      ></ui-progress-value>
      <ui-progress-track
        class="block h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <ui-progress-indicator
          class="block h-full bg-primary transition-[width] motion-reduce:transition-none"
        ></ui-progress-indicator>
      </ui-progress-track>
    </ui-progress>
    <ui-tree
      aria-labelledby="subtasks-label"
      checkable
      mode="none"
      check-strategy="leaf"
      default-expanded=${expanded.join(",")}
      .items=${itemsOf(issue.subtasks)}
      .checked=${checked}
      @checkedchange=${onChange(
        () => doneOf(issueOf(issue.id)?.subtasks ?? []),
        (done) => setSubtasksDone(issue.id, done)
      )}
      class="flex flex-col rounded-2xl border border-border p-1"
    >
      <template>
        <ui-tree-item class="flex flex-wrap items-center outline-none">
          <ui-tree-item-checkbox
            class="relative ms-2 flex size-4 shrink-0 cursor-default items-center justify-center rounded-[5px] bg-input/90 after:text-[10px] after:leading-none after:text-primary-foreground data-checked:bg-primary data-checked:after:content-['✓'] data-indeterminate:bg-primary data-indeterminate:after:content-['–']"
          ></ui-tree-item-checkbox>
          <ui-tree-item-label
            class="flex h-7 min-w-0 flex-1 cursor-default items-center rounded-xl px-2 text-sm select-none hover:bg-muted [[data-checked]>&]:text-muted-foreground [[data-checked]>&]:line-through [:focus-visible>&]:ring-3 [:focus-visible>&]:ring-ring/30 [:focus-visible>&]:ring-inset"
          ></ui-tree-item-label>
          <ui-tree-group
            class="h-(--tree-group-height) basis-full overflow-hidden ps-6 transition-[height] duration-200 ease-out data-starting-style:h-0 data-ending-style:h-0 motion-reduce:transition-none"
          ></ui-tree-group>
        </ui-tree-item>
      </template>
    </ui-tree>
  </section>`
}

export { subtasks }
