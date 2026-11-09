import { createDialogController } from "@ui-sdk/core/dialog"
import { toast } from "@ui-sdk/web"
import { cn } from "cn"
import { html, nothing } from "lit-html"
import {
  people,
  personOf,
  priorities,
  readNewIssue,
  statuses,
} from "tracker-data"
import { icon } from "../lib/icons"
import { navigate } from "../lib/router"
import { createIssue } from "../lib/tracker"
import {
  avatar,
  button,
  comboboxItem,
  comboboxTrigger,
  selectItem,
  selectTrigger,
  styles,
  tooltip,
} from "../lib/ui"
import { redraw } from "../lib/view"

const newIssue = createDialogController()

let error: string | null = null

function setError(message: string | null) {
  if (error === message) {
    return
  }
  error = message
  redraw()
}

function submit(event: SubmitEvent) {
  event.preventDefault()
  const form = event.currentTarget as HTMLFormElement
  const input = readNewIssue(Object.fromEntries(new FormData(form)))
  if ("error" in input) {
    return setError(input.error)
  }
  const id = createIssue(input)
  form.reset()
  newIssue.close()
  toast.success(`${id} created`)
  navigate(`/?issue=${id}`)
}

function newIssueForm() {
  return html`<form @submit=${submit} class="grid gap-5">
    <ui-field name="title" class="grid gap-2" ?invalid=${error !== null}>
      <ui-field-label class=${styles.label}>Title</ui-field-label>
      <input
        required
        autocomplete="off"
        placeholder="What needs doing?"
        class=${styles.control}
        @input=${() => setError(null)}
      />
      <ui-field-error match="valueMissing" class=${styles.error}
        >Give the issue a title.</ui-field-error
      >
      ${error ? html`<ui-field-error match="" class=${styles.error}>${error}</ui-field-error>` : nothing}
    </ui-field>
    <ui-field name="description" class="grid gap-2">
      <ui-field-label class=${styles.label}>Description</ui-field-label>
      <textarea
        placeholder="Add details, steps to reproduce or links."
        class=${cn(styles.control, "h-auto min-h-20 resize-none py-2")}
      ></textarea>
    </ui-field>
    <div class="grid gap-4 sm:grid-cols-3">
      <ui-select name="status" default-value="todo">
        <div class="grid gap-2">
          <ui-select-label class=${styles.label}>Status</ui-select-label>
          ${selectTrigger()}
        </div>
        <ui-select-content class=${styles.list}>
          ${statuses.map((status) => selectItem(status.value, status.label))}
        </ui-select-content>
      </ui-select>
      <ui-select name="priority" default-value="none">
        <div class="grid gap-2">
          <ui-select-label class=${styles.label}>Priority</ui-select-label>
          ${selectTrigger()}
        </div>
        <ui-select-content class=${styles.list}>
          ${priorities.map((priority) => selectItem(priority.value, priority.label))}
        </ui-select-content>
      </ui-select>
      <ui-combobox
        name="assignee"
        .itemToLabel=${(id: string) => personOf(id)?.name ?? ""}
      >
        <div class="grid gap-2">
          <ui-combobox-label class=${styles.label}>Assignee</ui-combobox-label>
          <div class="relative">
            <ui-combobox-input>
              <input placeholder="Nobody" class=${styles.comboboxInput} />
            </ui-combobox-input>
            ${comboboxTrigger("Show people")}
          </div>
        </div>
        <ui-combobox-content
          class=${cn(styles.list, "w-(--anchor-width) min-w-44")}
        >
          <ui-combobox-empty class=${styles.empty}
            >Nobody matches.</ui-combobox-empty
          >
          <ui-combobox-list>
            ${people.map((person) =>
              comboboxItem(
                person.id,
                person.name,
                html`${avatar(person.name, { size: "sm", decorative: true })}
                ${person.name}`
              )
            )}
          </ui-combobox-list>
        </ui-combobox-content>
      </ui-combobox>
    </div>
    <div class="flex justify-end gap-2">
      <ui-dialog-close
        ><button type="button" class=${button({ variant: "ghost" })}>
          Cancel
        </button></ui-dialog-close
      >
      <button type="submit" class=${button({ variant: "primary" })}>
        Create issue
      </button>
    </div>
  </form>`
}

function newIssueDialog() {
  return html`<ui-dialog
    .controller=${newIssue}
    @openchange=${() => setError(null)}
  >
    ${tooltip(
      html`<ui-dialog-trigger shortcut="c">
        <button
          aria-label="New issue"
          class=${button({ variant: "primary", size: "icon" })}
        >
          ${icon("plus")}
        </button>
      </ui-dialog-trigger>`,
      "New issue",
      { shortcut: "c" }
    )}
    <ui-dialog-backdrop hidden class=${styles.backdrop}></ui-dialog-backdrop>
    <ui-dialog-content hidden class=${cn(styles.dialog, "sm:max-w-lg")}>
      <ui-dialog-title class=${styles.dialogTitle}>New issue</ui-dialog-title>
      ${newIssueForm()}
    </ui-dialog-content>
  </ui-dialog>`
}

export { newIssue, newIssueDialog }
