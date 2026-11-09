"use client"

import type { TreeItemData } from "@ui-sdk/react/tree"
import { startTransition, useOptimistic } from "react"
import { leaves, type Issue, type Subtask } from "tracker-data"
import { setSubtasksDone } from "@/app/actions"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/toast"
import { Tree, TreeItem } from "@/components/ui/tree"

function toItems(subtasks: Subtask[]): TreeItemData[] {
  return subtasks.map((subtask) => ({
    value: subtask.id,
    label: subtask.title,
    children: subtask.subtasks && toItems(subtask.subtasks),
  }))
}

function Items({ subtasks }: { subtasks: Subtask[] }) {
  return subtasks.map((subtask) => (
    <TreeItem key={subtask.id} value={subtask.id} label={subtask.title}>
      {subtask.subtasks && <Items subtasks={subtask.subtasks} />}
    </TreeItem>
  ))
}

function Subtasks({ issue }: { issue: Issue }) {
  const all = leaves(issue.subtasks)
  const [checked, setChecked] = useOptimistic(
    all.filter((subtask) => subtask.done).map((subtask) => subtask.id)
  )
  if (all.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="subtasks-label" className="grid gap-3">
      <h3 id="subtasks-label" className="text-sm font-medium">
        Subtasks
      </h3>
      <Progress
        label="Done"
        value={checked.length}
        max={all.length}
        format={(value) => `${value} of ${all.length}`}
      />
      <Tree
        aria-labelledby="subtasks-label"
        items={toItems(issue.subtasks)}
        checkable
        mode="none"
        checkStrategy="leaf"
        checked={checked}
        onCheckedChange={(next) =>
          startTransition(async () => {
            setChecked(next)
            try {
              await setSubtasksDone(issue.id, next)
            } catch {
              toast.error("Couldn't save your changes. Try again.")
            }
          })
        }
        defaultExpanded={issue.subtasks
          .filter((subtask) => subtask.subtasks)
          .map((subtask) => subtask.id)}
        className="flex flex-col rounded-2xl border border-border p-1"
      >
        <Items subtasks={issue.subtasks} />
      </Tree>
    </section>
  )
}

export { Subtasks }
