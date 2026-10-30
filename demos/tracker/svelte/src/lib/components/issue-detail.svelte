<script lang="ts">
  import { X } from "@lucide/svelte"
  import Activity from "#lib/components/activity.svelte"
  import PriorityIcon from "#lib/components/priority-icon.svelte"
  import StatusIcon from "#lib/components/status-icon.svelte"
  import Subtasks from "#lib/components/subtasks.svelte"
  import { act } from "#lib/act.ts"
  import { Avatar } from "#ui/avatar"
  import { buttonVariants } from "#ui/button"
  import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
  } from "#ui/combobox"
  import { DatePicker } from "#ui/date-picker"
  import { Field, FieldControl, FieldLabel } from "#ui/field"
  import { Radio, RadioGroup } from "#ui/radio"
  import { ScrollArea } from "#ui/scroll-area"
  import { Select, SelectContent, SelectItem, SelectItemIcon, SelectLabel, SelectTrigger } from "#ui/select"
  import { Textarea } from "#ui/textarea"
  import { Tooltip, TooltipContent, TooltipTrigger } from "#ui/tooltip"
  import { cn } from "cn"
  import { href, labelOf, labels, people, personOf, priorities, statuses, type Issue, type Query } from "tracker-data"

  let { issue, query }: { issue: Issue; query: Query } = $props()

  function save(fields: Record<string, string | string[] | null>) {
    act("update", { id: issue.id, ...fields })
  }
</script>

<article aria-labelledby="issue-title" class="flex min-h-0 flex-1 flex-col">
  <div class="flex h-11 shrink-0 items-center gap-2 border-b border-border ps-4 pe-2">
    <span class="text-sm text-muted-foreground tabular-nums">{issue.id}</span>
    <Tooltip>
      <TooltipTrigger aria-label="Close issue" class={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "ms-auto")}>
        {#snippet render({ props })}
          <a {...props} href={href(query, { issue: null })}>
            <X aria-hidden="true" />
          </a>
        {/snippet}
      </TooltipTrigger>
      <TooltipContent>Close</TooltipContent>
    </Tooltip>
  </div>
  <ScrollArea label="Issue details" class="flex-1">
    <div class="grid gap-6 p-4">
      <h2 id="issue-title" class="sr-only">{issue.title}</h2>
      <Field name="title">
        <FieldLabel class="sr-only">Title</FieldLabel>
        <FieldControl
          defaultValue={issue.title}
          required
          class="h-auto bg-transparent px-1.5 py-1 text-lg font-semibold md:text-lg"
          onblur={(event: FocusEvent) => {
            const title = (event.currentTarget as HTMLInputElement).value.trim()
            if (title && title !== issue.title) save({ title })
          }}
        />
      </Field>
      <Field name="description">
        <FieldLabel class="sr-only">Description</FieldLabel>
        <Textarea
          defaultValue={issue.description}
          placeholder="Add a description…"
          class="bg-transparent px-1.5"
          onblur={(event: FocusEvent) => {
            const description = (event.currentTarget as HTMLTextAreaElement).value
            if (description !== issue.description) save({ description })
          }}
        />
      </Field>
      <div class="grid gap-4 sm:grid-cols-2">
        <Select items={statuses} value={issue.status} onValueChange={(status) => status && save({ status: status as string })}>
          <div class="grid gap-2">
            <SelectLabel>Status</SelectLabel>
            <SelectTrigger icon />
          </div>
          <SelectContent>
            {#each statuses as status (status.value)}
              <SelectItem value={status.value}>
                <SelectItemIcon><StatusIcon status={status.value} /></SelectItemIcon>
                {status.label}
              </SelectItem>
            {/each}
          </SelectContent>
        </Select>
        <Combobox
          value={issue.assignee}
          onValueChange={(assignee) => save({ assignee: assignee as string | null })}
          itemToLabel={(id: string) => personOf(id)?.name ?? ""}
        >
          <div class="grid gap-2">
            <ComboboxLabel>Assignee</ComboboxLabel>
            <div class="relative">
              <ComboboxInput
                placeholder="Nobody"
                class="h-8 w-full rounded-2xl bg-input/50 px-2.5 pe-8 focus-visible:ring-3 focus-visible:ring-ring/30"
              />
              <ComboboxTrigger aria-label="Show people" />
            </div>
          </div>
          <ComboboxContent>
            <ComboboxEmpty>Nobody matches.</ComboboxEmpty>
            <ComboboxList>
              {#each people as person (person.id)}
                <ComboboxItem value={person.id} label={person.name}>
                  <Avatar name={person.name} size="sm" decorative />
                  {person.name}
                </ComboboxItem>
              {/each}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Field>
          <FieldLabel>Due date</FieldLabel>
          <DatePicker value={issue.due} onValueChange={(due) => save({ due: due as string | null })} />
        </Field>
        <Combobox
          multiple
          value={issue.labels}
          onValueChange={(value) => save({ labels: value as string[] })}
          itemToLabel={(id: string) => labelOf(id)?.name ?? id}
        >
          <div class="grid gap-2">
            <ComboboxLabel>Labels</ComboboxLabel>
            <ComboboxChips>
              <ComboboxValue>
                {#snippet children(state)}
                  {#each state.value as string[] as id, index (id)}
                    <ComboboxChip value={id} label={state.labels[index]}>
                      <span class="size-2 rounded-full" style:background={labelOf(id)?.color}></span>
                    </ComboboxChip>
                  {/each}
                {/snippet}
              </ComboboxValue>
              <ComboboxInput placeholder={issue.labels.length ? "" : "Add a label"} />
              <ComboboxTrigger aria-label="Show labels" />
            </ComboboxChips>
          </div>
          <ComboboxContent>
            <ComboboxEmpty>No labels match.</ComboboxEmpty>
            <ComboboxList>
              {#each labels as label (label.id)}
                <ComboboxItem value={label.id} label={label.name}>
                  <span class="size-2 rounded-full" style:background={label.color}></span>
                  {label.name}
                </ComboboxItem>
              {/each}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <RadioGroup
        aria-labelledby="priority-label"
        value={issue.priority}
        onValueChange={(priority) => save({ priority: priority as string })}
        class="grid gap-2"
      >
        <span id="priority-label" class="text-sm leading-none font-medium">Priority</span>
        <div class="flex flex-wrap gap-x-4 gap-y-2">
          {#each priorities as priority (priority.value)}
            <label class="flex items-center gap-2">
              <Radio value={priority.value} />
              <PriorityIcon priority={priority.value} />
              {priority.label}
            </label>
          {/each}
        </div>
      </RadioGroup>
      <Subtasks {issue} />
      <Activity {issue} />
    </div>
  </ScrollArea>
</article>
