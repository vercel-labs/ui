import { cn } from "cn"
import { For } from "solid-js"
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
import { X } from "@/components/icons"
import { IssueActivity } from "@/components/issue-activity"
import { PriorityIcon, StatusIcon } from "@/components/issue-icons"
import { Subtasks } from "@/components/subtasks"
import { Avatar } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
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
} from "@/components/ui/combobox"
import { DatePicker } from "@/components/ui/date-picker"
import { Field, FieldControl, FieldLabel } from "@/components/ui/field"
import { Radio, RadioGroup } from "@/components/ui/radio"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { updateIssues } from "@/lib/tracker"

function IssueDetail(props: { issue: Issue; query: Query }) {
  function save(patch: IssuePatch) {
    updateIssues([props.issue.id], patch)
  }

  return (
    <article aria-labelledby="issue-title" class="flex min-h-0 flex-1 flex-col">
      <div class="flex h-11 shrink-0 items-center gap-2 border-b border-border ps-4 pe-2">
        <span class="text-sm text-muted-foreground tabular-nums">{props.issue.id}</span>
        <Tooltip>
          <TooltipTrigger
            render={(attributes) => <a {...attributes} href={href(props.query, { issue: null })} noscroll />}
            aria-label="Close issue"
            class={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "ms-auto")}
          >
            <X aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </div>
      <ScrollArea label="Issue details" class="flex-1">
        <div class="grid gap-6 p-4">
          <h2 id="issue-title" class="sr-only">
            {props.issue.title}
          </h2>
          <Field name="title">
            <FieldLabel class="sr-only">Title</FieldLabel>
            <FieldControl
              defaultValue={props.issue.title}
              required
              class="h-auto bg-transparent px-1.5 py-1 text-lg font-semibold md:text-lg"
              onBlur={(event) => {
                const title = event.currentTarget.value.trim()
                if (title && title !== props.issue.title) save({ title })
              }}
            />
          </Field>
          <Field name="description">
            <FieldLabel class="sr-only">Description</FieldLabel>
            <Textarea
              defaultValue={props.issue.description}
              placeholder="Add a description…"
              class="bg-transparent px-1.5"
              onBlur={(event) => {
                const description = event.currentTarget.value
                if (description !== props.issue.description) save({ description })
              }}
            />
          </Field>
          <div class="grid gap-4 sm:grid-cols-2">
            <Select
              items={statuses}
              value={props.issue.status}
              onValueChange={(status) => status && save({ status: status as Issue["status"] })}
            >
              <div class="grid gap-2">
                <SelectLabel>Status</SelectLabel>
                <SelectTrigger icon />
              </div>
              <SelectContent>
                <For each={statuses}>
                  {(status) => (
                    <SelectItem value={status.value}>
                      <SelectItemIcon>
                        <StatusIcon status={status.value} />
                      </SelectItemIcon>
                      {status.label}
                    </SelectItem>
                  )}
                </For>
              </SelectContent>
            </Select>
            <Combobox
              value={props.issue.assignee}
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
                  <For each={people}>
                    {(person) => (
                      <ComboboxItem value={person.id} label={person.name}>
                        <Avatar name={person.name} size="sm" decorative />
                        {person.name}
                      </ComboboxItem>
                    )}
                  </For>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Field>
              <FieldLabel>Due date</FieldLabel>
              <DatePicker
                value={props.issue.due}
                onValueChange={(due) => save({ due: due as string | null })}
              />
            </Field>
            <Combobox
              multiple
              value={props.issue.labels}
              onValueChange={(value) => save({ labels: value as string[] })}
              itemToLabel={(id: string) => labelOf(id)?.name ?? id}
            >
              <div class="grid gap-2">
                <ComboboxLabel>Labels</ComboboxLabel>
                <ComboboxChips>
                  <ComboboxValue>
                    {(state) => (
                      <For each={state.value as string[]}>
                        {(id, index) => (
                          <ComboboxChip value={id} label={state.labels[index()]}>
                            <span class="size-2 rounded-full" style={{ background: labelOf(id)?.color }} />
                          </ComboboxChip>
                        )}
                      </For>
                    )}
                  </ComboboxValue>
                  <ComboboxInput placeholder={props.issue.labels.length ? "" : "Add a label"} />
                  <ComboboxTrigger aria-label="Show labels" />
                </ComboboxChips>
              </div>
              <ComboboxContent>
                <ComboboxEmpty>No labels match.</ComboboxEmpty>
                <ComboboxList>
                  <For each={labels}>
                    {(label) => (
                      <ComboboxItem value={label.id} label={label.name}>
                        <span class="size-2 rounded-full" style={{ background: label.color }} />
                        {label.name}
                      </ComboboxItem>
                    )}
                  </For>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          <RadioGroup
            aria-labelledby="priority-label"
            value={props.issue.priority}
            onValueChange={(priority) => save({ priority: priority as Issue["priority"] })}
            class="grid gap-2"
          >
            <span id="priority-label" class="text-sm leading-none font-medium">
              Priority
            </span>
            <div class="flex flex-wrap gap-x-4 gap-y-2">
              <For each={priorities}>
                {(priority) => (
                  <label class="flex items-center gap-2">
                    <Radio value={priority.value} />
                    <PriorityIcon priority={priority.value} />
                    {priority.label}
                  </label>
                )}
              </For>
            </div>
          </RadioGroup>
          <Subtasks issue={props.issue} />
          <IssueActivity issue={props.issue} />
        </div>
      </ScrollArea>
    </article>
  )
}

export { IssueDetail }
