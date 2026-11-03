import type { TreeItemData } from "@ui-sdk/solid/tree"
import { createMemo, For, Show, untrack } from "solid-js"
import { leaves, type Issue, type Subtask } from "tracker-data"
import { Progress } from "@/components/ui/progress"
import { Tree, TreeItem } from "@/components/ui/tree"
import { setSubtasksDone } from "@/lib/tracker"

function toItems(subtasks: Subtask[]): TreeItemData[] {
  return subtasks.map((subtask) => ({
    value: subtask.id,
    label: subtask.title,
    children: subtask.subtasks && toItems(subtask.subtasks),
  }))
}

function Items(props: { subtasks: Subtask[] }) {
  return (
    <For each={props.subtasks}>
      {(subtask) => (
        <TreeItem value={subtask.id} label={subtask.title}>
          {subtask.subtasks && <Items subtasks={subtask.subtasks} />}
        </TreeItem>
      )}
    </For>
  )
}

function Subtasks(props: { issue: Issue }) {
  const all = createMemo(() => leaves(props.issue.subtasks))
  const checked = createMemo(() =>
    all()
      .filter((subtask) => subtask.done)
      .map((subtask) => subtask.id),
  )
  const items = createMemo(() => toItems(props.issue.subtasks))
  const expanded = untrack(() =>
    props.issue.subtasks.filter((subtask) => subtask.subtasks).map((subtask) => subtask.id),
  )

  return (
    <Show when={all().length > 0}>
      <section aria-labelledby="subtasks-label" class="grid gap-3">
        <h3 id="subtasks-label" class="text-sm font-medium">
          Subtasks
        </h3>
        <Progress
          label="Done"
          value={checked().length}
          max={all().length}
          format={(value) => `${value} of ${all().length}`}
        />
        <Tree
          aria-labelledby="subtasks-label"
          items={items()}
          checkable
          mode="none"
          checkStrategy="leaf"
          checked={checked()}
          onCheckedChange={(next) => setSubtasksDone(props.issue.id, next)}
          defaultExpanded={expanded}
          class="flex flex-col rounded-2xl border border-border p-1"
        >
          <Items subtasks={props.issue.subtasks} />
        </Tree>
      </section>
    </Show>
  )
}

export { Subtasks }
