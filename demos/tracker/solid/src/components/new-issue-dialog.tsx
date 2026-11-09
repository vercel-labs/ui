import { useNavigate } from "@solidjs/router"
import { createSignal, For, Show } from "solid-js"
import {
  people,
  personOf,
  priorities,
  readNewIssue,
  statuses,
} from "tracker-data"
import { Plus } from "@/components/icons"
import { Avatar } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import {
  createDialogController,
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldControl,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipShortcut,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { createIssue } from "@/lib/tracker"

const newIssue = createDialogController()

function NewIssueForm() {
  const navigate = useNavigate()
  const [error, setError] = createSignal<string | null>(null)

  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault()
    const input = readNewIssue(
      Object.fromEntries(new FormData(event.currentTarget))
    )
    if ("error" in input) {
      return setError(input.error)
    }
    const id = createIssue(input)
    newIssue.close()
    toast.success(`${id} created`)
    navigate(`/?issue=${id}`)
  }

  return (
    <form onSubmit={submit} class="grid gap-5">
      <Field name="title" invalid={error() ? true : undefined}>
        <FieldLabel>Title</FieldLabel>
        <FieldControl
          required
          autocomplete="off"
          placeholder="What needs doing?"
          onInput={() => setError(null)}
        />
        <FieldError match="valueMissing">Give the issue a title.</FieldError>
        <Show when={error()}>
          <FieldError match>{error()}</FieldError>
        </Show>
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
            <For each={statuses}>
              {(status) => (
                <SelectItem value={status.value}>{status.label}</SelectItem>
              )}
            </For>
          </SelectContent>
        </Select>
        <Select name="priority" items={priorities} defaultValue="none">
          <div class="grid gap-2">
            <SelectLabel>Priority</SelectLabel>
            <SelectTrigger />
          </div>
          <SelectContent>
            <For each={priorities}>
              {(priority) => (
                <SelectItem value={priority.value}>{priority.label}</SelectItem>
              )}
            </For>
          </SelectContent>
        </Select>
        <Combobox
          name="assignee"
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
      </div>
      <div class="flex justify-end gap-2">
        <DialogClose class={buttonVariants({ variant: "ghost" })}>
          Cancel
        </DialogClose>
        <Button type="submit" variant="primary">
          Create issue
        </Button>
      </div>
    </form>
  )
}

function NewIssueDialog() {
  return (
    <Dialog controller={newIssue}>
      <Tooltip shortcut="c">
        <TooltipTrigger
          render={(props) => <DialogTrigger {...props} shortcut="c" />}
          aria-label="New issue"
          class={buttonVariants({ variant: "primary", size: "icon" })}
        >
          <Plus aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>
          New issue
          <TooltipShortcut class="text-background/60" />
        </TooltipContent>
      </Tooltip>
      <DialogBackdrop />
      <DialogContent class="sm:max-w-lg">
        <DialogTitle>New issue</DialogTitle>
        <NewIssueForm />
      </DialogContent>
    </Dialog>
  )
}

export { NewIssueDialog, newIssue }
