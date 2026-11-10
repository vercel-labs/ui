<script setup lang="ts">
import { Plus } from "@lucide/vue"
import { people, personOf, priorities, statuses } from "tracker-data"
import { Avatar } from "~/components/ui/avatar"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "~/components/ui/combobox"
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "~/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "~/components/ui/tooltip"

const tracker = useTracker()
const error = ref<string | null>(null)
const pending = ref(false)

async function submit(event: SubmitEvent) {
  pending.value = true
  try {
    const issue = await createIssue(
      new FormData(event.currentTarget as HTMLFormElement)
    )
    error.value = null
    tracker.newIssue.close()
    toast.success(`${issue.id} created`)
    await navigateTo(`/?issue=${issue.id}`)
  } catch (failure) {
    error.value =
      (failure as { data?: { message?: string } }).data?.message ??
      "The issue couldn't be created."
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <Dialog :controller="tracker.newIssue">
    <Tooltip shortcut="c">
      <TooltipTrigger
        aria-label="New issue"
        :class="buttonVariants({ variant: 'primary', size: 'icon' })"
      >
        <template #render="{ props }">
          <DialogTrigger v-bind="props" shortcut="c">
            <Plus aria-hidden="true" />
          </DialogTrigger>
        </template>
      </TooltipTrigger>
      <TooltipContent>
        New issue
        <TooltipShortcut class="text-background/60" />
      </TooltipContent>
    </Tooltip>
    <DialogBackdrop />
    <DialogContent class="sm:max-w-lg">
      <DialogTitle>New issue</DialogTitle>
      <form class="grid gap-5" @submit.prevent="submit">
        <Field name="title" :invalid="error ? true : undefined">
          <FieldLabel>Title</FieldLabel>
          <FieldControl
            required
            autocomplete="off"
            placeholder="What needs doing?"
            @input="error = null"
          />
          <FieldError match="valueMissing">Give the issue a title.</FieldError>
          <FieldError v-if="error" :match="true">{{ error }}</FieldError>
        </Field>
        <Field name="description">
          <FieldLabel>Description</FieldLabel>
          <Textarea placeholder="Add details, steps to reproduce or links." />
        </Field>
        <div class="grid gap-4 sm:grid-cols-3">
          <Select name="status" :items="statuses" default-value="todo">
            <div class="grid gap-2">
              <SelectLabel>Status</SelectLabel>
              <SelectTrigger />
            </div>
            <SelectContent>
              <SelectItem
                v-for="status in statuses"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select name="priority" :items="priorities" default-value="none">
            <div class="grid gap-2">
              <SelectLabel>Priority</SelectLabel>
              <SelectTrigger />
            </div>
            <SelectContent>
              <SelectItem
                v-for="priority in priorities"
                :key="priority.value"
                :value="priority.value"
              >
                {{ priority.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Combobox
            name="assignee"
            :item-to-label="(id: string) => personOf(id)?.name ?? ''"
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
        </div>
        <div class="flex justify-end gap-2">
          <DialogClose :class="buttonVariants({ variant: 'ghost' })"
            >Cancel</DialogClose
          >
          <Button type="submit" variant="primary" :disabled="pending">
            {{ pending ? "Creating…" : "Create issue" }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
