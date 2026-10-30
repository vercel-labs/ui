<script lang="ts">
  import { Plus } from "@lucide/svelte"
  import { enhance, type SubmitFunction } from "$app/forms"
  import { goto } from "$app/navigation"
  import { Avatar } from "#ui/avatar"
  import { Button, buttonVariants } from "#ui/button"
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxTrigger,
  } from "#ui/combobox"
  import {
    Dialog,
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
  } from "#ui/dialog"
  import { Field, FieldControl, FieldError, FieldLabel } from "#ui/field"
  import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "#ui/select"
  import { Textarea } from "#ui/textarea"
  import { toast } from "#ui/toast"
  import { Tooltip, TooltipContent, TooltipShortcut, TooltipTrigger } from "#ui/tooltip"
  import { getTracker } from "#lib/tracker.svelte.ts"
  import { people, personOf, priorities, statuses } from "tracker-data"

  const tracker = getTracker()
  let error = $state<string | null>(null)
  let pending = $state(false)

  const submit: SubmitFunction = () => {
    pending = true
    return async ({ result, update }) => {
      pending = false
      if (result.type === "success" && result.data?.id) {
        tracker.newIssue.close()
        toast.success(`${result.data.id} created`)
        await goto(`/?issue=${result.data.id}`, { invalidateAll: true })
        return
      }
      if (result.type === "failure") error = String(result.data?.error ?? "Couldn't create the issue.")
      else if (result.type === "error") error = "Couldn't create the issue. Try again."
      await update({ reset: false })
    }
  }
</script>

<Dialog controller={tracker.newIssue} onOpenChange={(open) => !open && (error = null)}>
  <Tooltip shortcut="c">
    <TooltipTrigger aria-label="New issue" class={buttonVariants({ variant: "primary", size: "icon" })}>
      {#snippet render({ props })}
        <DialogTrigger {...props} shortcut="c">
          <Plus aria-hidden="true" />
        </DialogTrigger>
      {/snippet}
    </TooltipTrigger>
    <TooltipContent>
      New issue
      <TooltipShortcut class="text-background/60" />
    </TooltipContent>
  </Tooltip>
  <DialogBackdrop />
  <DialogContent class="sm:max-w-lg">
    <DialogTitle>New issue</DialogTitle>
    <form method="POST" action="/?/create" use:enhance={submit} class="grid gap-5">
      <Field name="title" invalid={error ? true : undefined}>
        <FieldLabel>Title</FieldLabel>
        <FieldControl required autocomplete="off" placeholder="What needs doing?" oninput={() => (error = null)} />
        <FieldError match="valueMissing">Give the issue a title.</FieldError>
        {#if error}
          <FieldError match>{error}</FieldError>
        {/if}
      </Field>
      <Field name="description">
        <FieldLabel>Description</FieldLabel>
        <Textarea placeholder="Add details, steps to reproduce or links." />
      </Field>
      <div class="grid gap-4 sm:grid-cols-3">
        <Select name="status" items={statuses} defaultValue="todo">
          <div class="grid gap-2">
            <SelectLabel>Status</SelectLabel>
            <SelectTrigger />
          </div>
          <SelectContent>
            {#each statuses as status (status.value)}
              <SelectItem value={status.value}>{status.label}</SelectItem>
            {/each}
          </SelectContent>
        </Select>
        <Select name="priority" items={priorities} defaultValue="none">
          <div class="grid gap-2">
            <SelectLabel>Priority</SelectLabel>
            <SelectTrigger />
          </div>
          <SelectContent>
            {#each priorities as priority (priority.value)}
              <SelectItem value={priority.value}>{priority.label}</SelectItem>
            {/each}
          </SelectContent>
        </Select>
        <Combobox name="assignee" itemToLabel={(id: string) => personOf(id)?.name ?? ""}>
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
      </div>
      <div class="flex justify-end gap-2">
        <DialogClose class={buttonVariants({ variant: "ghost" })}>Cancel</DialogClose>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Creating…" : "Create issue"}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>
