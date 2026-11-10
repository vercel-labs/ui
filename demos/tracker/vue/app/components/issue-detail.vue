<script setup lang="ts">
import { X } from "@lucide/vue"
import { cn } from "cn"
import {
  href,
  type Issue,
  labelOf,
  labels,
  people,
  personOf,
  type Priority,
  priorities,
  type Query,
  type Status,
  statuses,
  type IssuePatch,
} from "tracker-data"
import IssueActivity from "~/components/issue-activity.vue"
import PriorityIcon from "~/components/priority-icon.vue"
import StatusIcon from "~/components/status-icon.vue"
import Subtasks from "~/components/subtasks.vue"
import { Avatar } from "~/components/ui/avatar"
import { buttonVariants } from "~/components/ui/button"
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
} from "~/components/ui/combobox"
import { DatePicker } from "~/components/ui/date-picker"
import { Field, FieldControl, FieldLabel } from "~/components/ui/field"
import { Radio, RadioGroup } from "~/components/ui/radio"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"

const props = defineProps<{ issue: Issue; query: Query }>()

function save(patch: IssuePatch) {
  updateIssues([props.issue.id], patch)
}

function saveTitle(event: FocusEvent) {
  const title = (event.currentTarget as HTMLInputElement).value.trim()
  if (title && title !== props.issue.title) {
    save({ title })
  }
}

function saveDescription(event: FocusEvent) {
  const description = (event.currentTarget as HTMLTextAreaElement).value
  if (description !== props.issue.description) {
    save({ description })
  }
}
</script>

<template>
  <article aria-labelledby="issue-title" class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex h-11 shrink-0 items-center gap-2 border-b border-border ps-4 pe-2"
    >
      <span class="text-sm text-muted-foreground tabular-nums">{{
        issue.id
      }}</span>
      <Tooltip>
        <TooltipTrigger
          aria-label="Close issue"
          :class="
            cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'ms-auto')
          "
        >
          <template #render="{ props: trigger }">
            <NuxtLink v-bind="trigger" :to="href(query, { issue: null })">
              <X aria-hidden="true" />
            </NuxtLink>
          </template>
        </TooltipTrigger>
        <TooltipContent>Close</TooltipContent>
      </Tooltip>
    </div>
    <ScrollArea label="Issue details" class="flex-1">
      <div class="grid gap-6 p-4">
        <h2 id="issue-title" class="sr-only">{{ issue.title }}</h2>
        <Field name="title">
          <FieldLabel class="sr-only">Title</FieldLabel>
          <FieldControl
            :value="issue.title"
            required
            class="h-auto bg-transparent px-1.5 py-1 text-lg font-semibold md:text-lg"
            @blur="saveTitle"
          />
        </Field>
        <Field name="description">
          <FieldLabel class="sr-only">Description</FieldLabel>
          <Textarea
            :default-value="issue.description"
            placeholder="Add a description…"
            class="bg-transparent px-1.5"
            @blur="saveDescription"
          />
        </Field>
        <div class="grid gap-4 sm:grid-cols-2">
          <Select
            :items="statuses"
            :value="issue.status"
            @value-change="
              (status: string | null) =>
                status && save({ status: status as Status })
            "
          >
            <div class="grid gap-2">
              <SelectLabel>Status</SelectLabel>
              <SelectTrigger icon />
            </div>
            <SelectContent>
              <SelectItem
                v-for="status in statuses"
                :key="status.value"
                :value="status.value"
              >
                <SelectItemIcon
                  ><StatusIcon :status="status.value"
                /></SelectItemIcon>
                {{ status.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Combobox
            :value="issue.assignee"
            :item-to-label="(id: string) => personOf(id)?.name ?? ''"
            @value-change="(assignee: string | null) => save({ assignee })"
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
                <ComboboxItem
                  v-for="person in people"
                  :key="person.id"
                  :value="person.id"
                  :label="person.name"
                >
                  <Avatar :name="person.name" size="sm" decorative />
                  {{ person.name }}
                </ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <Field>
            <FieldLabel>Due date</FieldLabel>
            <DatePicker
              :value="issue.due"
              @value-change="(due: string | null) => save({ due })"
            />
          </Field>
          <Combobox
            multiple
            :value="issue.labels"
            :item-to-label="(id: string) => labelOf(id)?.name ?? id"
            @value-change="(value: string[]) => save({ labels: value })"
          >
            <div class="grid gap-2">
              <ComboboxLabel>Labels</ComboboxLabel>
              <ComboboxChips>
                <ComboboxValue v-slot="{ state }">
                  <ComboboxChip
                    v-for="(id, index) in state.value as string[]"
                    :key="id"
                    :value="id"
                    :label="state.labels[index]"
                  >
                    <span
                      class="size-2 rounded-full"
                      :style="{ background: labelOf(id)?.color }"
                    ></span>
                  </ComboboxChip>
                </ComboboxValue>
                <ComboboxInput
                  :placeholder="issue.labels.length ? '' : 'Add a label'"
                />
                <ComboboxTrigger aria-label="Show labels" />
              </ComboboxChips>
            </div>
            <ComboboxContent>
              <ComboboxEmpty>No labels match.</ComboboxEmpty>
              <ComboboxList>
                <ComboboxItem
                  v-for="label in labels"
                  :key="label.id"
                  :value="label.id"
                  :label="label.name"
                >
                  <span
                    class="size-2 rounded-full"
                    :style="{ background: label.color }"
                  ></span>
                  {{ label.name }}
                </ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
        <RadioGroup
          aria-labelledby="priority-label"
          :value="issue.priority"
          class="grid gap-2"
          @value-change="
            (priority: string) => save({ priority: priority as Priority })
          "
        >
          <span id="priority-label" class="text-sm leading-none font-medium"
            >Priority</span
          >
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <label
              v-for="priority in priorities"
              :key="priority.value"
              class="flex items-center gap-2"
            >
              <Radio :value="priority.value" />
              <PriorityIcon :priority="priority.value" />
              {{ priority.label }}
            </label>
          </div>
        </RadioGroup>
        <Subtasks :issue="issue" />
        <IssueActivity :issue="issue" />
      </div>
    </ScrollArea>
  </article>
</template>
