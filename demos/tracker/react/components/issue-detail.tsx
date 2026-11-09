"use client"

import { cn } from "cn"
import { X } from "lucide-react"
import Link from "next/link"
import { startTransition, useOptimistic } from "react"
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
import { updateIssues } from "@/app/actions"
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
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function IssueDetail({ issue: saved, query }: { issue: Issue; query: Query }) {
  const [issue, apply] = useOptimistic(saved, (issue, patch: IssuePatch) => ({
    ...issue,
    ...patch,
  }))

  function save(patch: IssuePatch) {
    startTransition(async () => {
      apply(patch)
      try {
        await updateIssues([issue.id], patch)
      } catch {
        toast.error("Couldn't save your changes. Try again.")
      }
    })
  }

  return (
    <article
      aria-labelledby="issue-title"
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border ps-4 pe-2">
        <span className="text-sm text-muted-foreground tabular-nums">
          {issue.id}
        </span>
        <Tooltip>
          <TooltipTrigger
            render={<Link href={href(query, { issue: null })} scroll={false} />}
            aria-label="Close issue"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon-sm" }),
              "ms-auto"
            )}
          >
            <X aria-hidden="true" />
          </TooltipTrigger>
          <TooltipContent>Close</TooltipContent>
        </Tooltip>
      </div>
      <ScrollArea label="Issue details" className="flex-1">
        <div className="grid gap-6 p-4">
          <h2 id="issue-title" className="sr-only">
            {issue.title}
          </h2>
          <Field name="title">
            <FieldLabel className="sr-only">Title</FieldLabel>
            <FieldControl
              defaultValue={issue.title}
              required
              className="h-auto bg-transparent px-1.5 py-1 text-lg font-semibold md:text-lg"
              onBlur={(event) => {
                const title = event.currentTarget.value.trim()
                if (title && title !== issue.title) {
                  save({ title })
                }
              }}
            />
          </Field>
          <Field name="description">
            <FieldLabel className="sr-only">Description</FieldLabel>
            <Textarea
              defaultValue={issue.description}
              placeholder="Add a description…"
              className="bg-transparent px-1.5"
              onBlur={(event) => {
                const description = event.currentTarget.value
                if (description !== issue.description) {
                  save({ description })
                }
              }}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              items={statuses}
              value={issue.status}
              onValueChange={(status) =>
                status && save({ status: status as Issue["status"] })
              }
            >
              <div className="grid gap-2">
                <SelectLabel>Status</SelectLabel>
                <SelectTrigger icon />
              </div>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <SelectItemIcon>
                      <StatusIcon status={status.value} />
                    </SelectItemIcon>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Combobox
              value={issue.assignee}
              onValueChange={(assignee) =>
                save({ assignee: assignee as string | null })
              }
              itemToLabel={(id: string) => personOf(id)?.name ?? ""}
            >
              <div className="grid gap-2">
                <ComboboxLabel>Assignee</ComboboxLabel>
                <div className="relative">
                  <ComboboxInput
                    placeholder="Nobody"
                    className="h-8 w-full rounded-2xl bg-input/50 px-2.5 pe-8 focus-visible:ring-3 focus-visible:ring-ring/30"
                  />
                  <ComboboxTrigger aria-label="Show people" />
                </div>
              </div>
              <ComboboxContent>
                <ComboboxEmpty>Nobody matches.</ComboboxEmpty>
                <ComboboxList>
                  {people.map((person) => (
                    <ComboboxItem
                      key={person.id}
                      value={person.id}
                      label={person.name}
                    >
                      <Avatar name={person.name} size="sm" decorative />
                      {person.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Field>
              <FieldLabel>Due date</FieldLabel>
              <DatePicker
                value={issue.due}
                onValueChange={(due) => save({ due: due as string | null })}
              />
            </Field>
            <Combobox
              multiple
              value={issue.labels}
              onValueChange={(value) => save({ labels: value as string[] })}
              itemToLabel={(id: string) => labelOf(id)?.name ?? id}
            >
              <div className="grid gap-2">
                <ComboboxLabel>Labels</ComboboxLabel>
                <ComboboxChips>
                  <ComboboxValue>
                    {(state) =>
                      (state.value as string[]).map((id, index) => (
                        <ComboboxChip
                          key={id}
                          value={id}
                          label={state.labels[index]}
                        >
                          <span
                            className="size-2 rounded-full"
                            style={{ background: labelOf(id)?.color }}
                          />
                        </ComboboxChip>
                      ))
                    }
                  </ComboboxValue>
                  <ComboboxInput
                    placeholder={issue.labels.length ? "" : "Add a label"}
                  />
                  <ComboboxTrigger aria-label="Show labels" />
                </ComboboxChips>
              </div>
              <ComboboxContent>
                <ComboboxEmpty>No labels match.</ComboboxEmpty>
                <ComboboxList>
                  {labels.map((label) => (
                    <ComboboxItem
                      key={label.id}
                      value={label.id}
                      label={label.name}
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ background: label.color }}
                      />
                      {label.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
          <RadioGroup
            aria-labelledby="priority-label"
            value={issue.priority}
            onValueChange={(priority) =>
              save({ priority: priority as Issue["priority"] })
            }
            className="grid gap-2"
          >
            <span
              id="priority-label"
              className="text-sm leading-none font-medium"
            >
              Priority
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {priorities.map((priority) => (
                <label key={priority.value} className="flex items-center gap-2">
                  <Radio value={priority.value} />
                  <PriorityIcon priority={priority.value} />
                  {priority.label}
                </label>
              ))}
            </div>
          </RadioGroup>
          <Subtasks issue={issue} />
          <IssueActivity issue={issue} />
        </div>
      </ScrollArea>
    </article>
  )
}

export { IssueDetail }
