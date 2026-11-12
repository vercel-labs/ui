<script lang="ts">
  import { act } from "#lib/act.ts"
  import { Progress } from "#ui/progress"
  import { Tree, TreeItem, type TreeItemData } from "#ui/tree"
  import { leaves, type Issue, type Subtask } from "tracker-data"

  interface Props {
    issue: Issue
  }

  let { issue }: Props = $props()

  const all = $derived(leaves(issue.subtasks))
  let checked = $derived(
    all.filter((subtask) => subtask.done).map((subtask) => subtask.id)
  )

  function toItems(subtasks: Subtask[]): TreeItemData[] {
    return subtasks.map((subtask) => ({
      value: subtask.id,
      label: subtask.title,
      children: subtask.subtasks && toItems(subtask.subtasks),
    }))
  }

  function save(next: string[]) {
    checked = next
    act("subtasks", { id: issue.id, done: next })
  }
</script>

{#snippet items(subtasks: Subtask[])}
  {#each subtasks as subtask (subtask.id)}
    {#if subtask.subtasks}
      <TreeItem value={subtask.id} label={subtask.title}>
        {@render items(subtask.subtasks)}
      </TreeItem>
    {:else}
      <TreeItem value={subtask.id} label={subtask.title} />
    {/if}
  {/each}
{/snippet}

{#if all.length > 0}
  <section aria-labelledby="subtasks-label" class="grid gap-3">
    <h3 id="subtasks-label" class="text-sm font-medium">Subtasks</h3>
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
      {checked}
      onCheckedChange={save}
      defaultExpanded={issue.subtasks
        .filter((subtask) => subtask.subtasks)
        .map((subtask) => subtask.id)}
      class="flex flex-col rounded-2xl border border-border p-1"
    >
      {@render items(issue.subtasks)}
    </Tree>
  </section>
{/if}
