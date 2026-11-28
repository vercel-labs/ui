import { Component, viewChild, type ElementRef } from "@angular/core"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/angular/field"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  type FileInputReject,
  type FileInputValueChange,
} from "@ui-sdk/angular/file-input"
import {
  describeChange,
  fileInputFixture,
  fileInputOptions,
  serializeFiles,
} from "../../../../../tests/fixtures/file-input"
import { mountAngular, state } from "../../angular-mount"

@Component({
  imports: [
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    FileInput,
    FileInputDropzone,
    FileInputItem,
    FileInputItemRemove,
    FileInputList,
    FileInputTrigger,
  ],
  template: `
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        [id]="f.formId"
        [attr.aria-label]="f.formLabel"
        (submit)="onSubmit($event)"
      >
        <div uiField>
          <label uiFieldLabel>{{ f.field.label }}</label>
          <div
            uiFileInput
            class="file-input"
            [name]="options.name"
            [accept]="f.attachments.accept"
            [multiple]="options.multiple"
            [maxFiles]="options.maxFiles"
            [maxSize]="f.attachments.maxSize"
            [minSize]="f.attachments.minSize"
            [required]="options.required"
            [disabled]="options.disabled"
            [value]="options.controlled ? attachments() : undefined"
            (beforeValueChange)="onChange('attachments', $event)"
            (reject)="onReject('attachments', $event)"
          >
            <div
              uiFileInputDropzone
              #zone="uiFileInputDropzone"
              class="zone"
              role="group"
              [attr.aria-label]="f.zone.label"
              [pasteTarget]="pasteTarget"
            >
              <p>{{ zone.state().dragging ? f.zone.dragging : f.zone.text }}</p>
              <button uiFileInputTrigger>{{ f.trigger.label }}</button>
            </div>
            <div
              uiFileInputList
              #list="uiFileInputList"
              class="file-list"
              [attr.aria-label]="f.list.label"
            >
              @for (file of list.state().value; track file) {
                <div uiFileInputItem class="file-item" [file]="file">
                  <span>{{ file.name }}</span>
                  <button uiFileInputItemRemove>×</button>
                </div>
              }
            </div>
          </div>
          <p uiFieldDescription>{{ f.field.description }}</p>
          <div *uiFieldError="'valueMissing'" class="field-error">
            {{ f.field.error }}
          </div>
        </div>
        <label>
          {{ f.note.label }}
          <textarea #note [name]="f.note.name"></textarea>
        </label>
        <div class="row">
          <button type="submit">Send</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <div
        uiFileInput
        [accept]="f.avatar.accept"
        [capture]="f.avatar.capture"
        (beforeValueChange)="onChange('avatar', $event)"
        (reject)="onReject('avatar', $event)"
      >
        <button uiFileInputTrigger>{{ f.avatar.label }}</button>
      </div>
      <div
        uiFileInput
        directory
        (beforeValueChange)="onChange('folder', $event)"
        (reject)="onReject('folder', $event)"
      >
        <button uiFileInputTrigger>{{ f.folder.label }}</button>
      </div>
      @if (options.page) {
        <div
          uiFileInput
          multiple
          (beforeValueChange)="onChange('page', $event)"
          (reject)="onReject('page', $event)"
        >
          <div
            uiFileInputDropzone
            class="page-zone"
            role="group"
            target="document"
            [attr.aria-label]="f.page.label"
          >
            {{ f.page.text }}
          </div>
        </div>
      }
      <button>After</button>
      <output role="status" aria-label="Last action">{{ action() }}</output>
      <output role="status" aria-label="Actions">{{ count() }}</output>
      <output role="status" aria-label="Submitted">{{ submitted() }}</output>
    </div>
  `,
})
class Fixture {
  readonly f = fileInputFixture
  readonly options = fileInputOptions()
  readonly action = state("")
  readonly count = state(0)
  readonly submitted = state("")
  readonly attachments = state<File[]>([])
  readonly note = viewChild<ElementRef<HTMLTextAreaElement>>("note")
  readonly pasteTarget = () => this.note()?.nativeElement ?? null

  // A change counts as an action, and shows its rejections too. Rejections
  // without a change only show. Both outputs emit in the same task.
  #changed = false

  onChange(kind: string, change: FileInputValueChange) {
    if (this.options.cancel) {
      change.cancel()
    }
    this.#changed = true
    queueMicrotask(() => (this.#changed = false))
    this.action.set(describeChange(kind, change))
    this.count.update((current) => current + 1)
    const ignored =
      this.options.ignoreRemovals && change.reason === "remove-press"
    if (kind === "attachments" && !change.canceled && !ignored) {
      this.attachments.set(change.value)
    }
  }

  onReject(kind: string, rejection: FileInputReject) {
    if (!this.#changed) {
      this.action.set(
        describeChange(kind, { ...rejection, rejected: rejection.value })
      )
    }
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault()
    this.submitted.set(serializeFiles(event.currentTarget as HTMLFormElement))
  }
}

function mount(root: HTMLElement) {
  return mountAngular(Fixture, root)
}

export { Fixture, mount }
