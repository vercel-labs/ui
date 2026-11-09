"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState } from "react"
import { people, personOf, priorities, statuses } from "tracker-data"
import { createIssue, type CreateIssueState } from "@/app/actions"
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

const newIssue = createDialogController()

function NewIssueForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(
    async (previous: CreateIssueState, form: FormData) => {
      const next: CreateIssueState = await createIssue(previous, form).catch(
        () => ({
          error: "Couldn't create the issue. Try again.",
        })
      )
      if (next.id) {
        newIssue.close()
        toast.success(`${next.id} created`)
        router.push(`/?issue=${next.id}`)
      }
      return next
    },
    {}
  )

  return (
    <form action={action} className="grid gap-5">
      <Field name="title" invalid={state.error ? true : undefined}>
        <FieldLabel>Title</FieldLabel>
        <FieldControl
          required
          autoComplete="off"
          placeholder="What needs doing?"
        />
        <FieldError match="valueMissing">Give the issue a title.</FieldError>
        {state.error && <FieldError match>{state.error}</FieldError>}
      </Field>
      <Field name="description">
        <FieldLabel>Description</FieldLabel>
        <Textarea placeholder="Add details, steps to reproduce or links." />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Select name="status" items={statuses} defaultValue="todo">
          <div className="grid gap-2">
            <SelectLabel>Status</SelectLabel>
            <SelectTrigger />
          </div>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select name="priority" items={priorities} defaultValue="none">
          <div className="grid gap-2">
            <SelectLabel>Priority</SelectLabel>
            <SelectTrigger />
          </div>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Combobox
          name="assignee"
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
      </div>
      <div className="flex justify-end gap-2">
        <DialogClose className={buttonVariants({ variant: "ghost" })}>
          Cancel
        </DialogClose>
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Creating…" : "Create issue"}
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
          render={<DialogTrigger shortcut="c" />}
          aria-label="New issue"
          className={buttonVariants({ variant: "primary", size: "icon" })}
        >
          <Plus aria-hidden="true" />
        </TooltipTrigger>
        <TooltipContent>
          New issue
          <TooltipShortcut className="text-background/60" />
        </TooltipContent>
      </Tooltip>
      <DialogBackdrop />
      <DialogContent className="sm:max-w-lg">
        <DialogTitle>New issue</DialogTitle>
        <NewIssueForm />
      </DialogContent>
    </Dialog>
  )
}

export { NewIssueDialog, newIssue }
