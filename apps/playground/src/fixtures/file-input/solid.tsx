import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/solid/field"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  type FileInputValueChangeDetails,
  type FileRejection,
} from "@ui-sdk/solid/file-input"
import { render } from "@solidjs/web"
import { createSignal, Show } from "solid-js"
import {
  describeChange,
  fileInputFixture as f,
  fileInputOptions,
  serializeFiles,
} from "tests/fixtures/file-input.ts"

function Fixture() {
  const options = fileInputOptions()
  const [action, setAction] = createSignal("")
  const [count, setCount] = createSignal(0)
  const [submitted, setSubmitted] = createSignal("")
  const [attachments, setAttachments] = createSignal<File[]>([])
  let note: HTMLTextAreaElement | undefined
  // A change counts as an action, and shows its rejections too. Rejections
  // without a change only show. Both callbacks run in the same task.
  let changed = false
  const callbacks = (kind: string) => ({
    onValueChange: (value: File[], details: FileInputValueChangeDetails) => {
      if (options.cancel) {
        details.cancel()
      }
      changed = true
      queueMicrotask(() => (changed = false))
      setAction(describeChange(kind, details))
      setCount((current) => current + 1)
      const ignored =
        options.ignoreRemovals && details.reason === "remove-press"
      if (kind === "attachments" && !details.canceled && !ignored) {
        setAttachments(value)
      }
    },
    onReject: (rejected: FileRejection[], details: { reason: string }) => {
      if (!changed) {
        setAction(describeChange(kind, { ...details, rejected }))
      }
    },
  })

  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="form"
        id={f.formId}
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serializeFiles(event.currentTarget))
        }}
      >
        <Field>
          <FieldLabel>{f.field.label}</FieldLabel>
          <FileInput
            name={options.name}
            accept={f.attachments.accept}
            multiple={options.multiple}
            maxFiles={options.maxFiles}
            maxSize={f.attachments.maxSize}
            minSize={f.attachments.minSize}
            required={options.required}
            disabled={options.disabled}
            value={options.controlled ? attachments() : undefined}
            {...callbacks("attachments")}
            class="file-input"
          >
            <FileInputDropzone
              class="zone"
              role="group"
              aria-label={f.zone.label}
              pasteTarget={() => note ?? null}
            >
              {(state) => (
                <>
                  <p>{state.dragging ? f.zone.dragging : f.zone.text}</p>
                  <FileInputTrigger>{f.trigger.label}</FileInputTrigger>
                </>
              )}
            </FileInputDropzone>
            <FileInputList aria-label={f.list.label} class="file-list">
              <FileInputItem class="file-item">
                {({ file }) => (
                  <>
                    <span>{file.name}</span>
                    <FileInputItemRemove>×</FileInputItemRemove>
                  </>
                )}
              </FileInputItem>
            </FileInputList>
          </FileInput>
          <FieldDescription>{f.field.description}</FieldDescription>
          <FieldError class="field-error" match="valueMissing">
            {f.field.error}
          </FieldError>
        </Field>
        <label>
          {f.note.label}
          <textarea ref={note} name={f.note.name} />
        </label>
        <div class="row">
          <button type="submit">Send</button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <FileInput
        accept={f.avatar.accept}
        capture={f.avatar.capture}
        {...callbacks("avatar")}
      >
        <FileInputTrigger>{f.avatar.label}</FileInputTrigger>
      </FileInput>
      <FileInput directory {...callbacks("folder")}>
        <FileInputTrigger>{f.folder.label}</FileInputTrigger>
      </FileInput>
      <Show when={options.page}>
        <FileInput multiple {...callbacks("page")}>
          <FileInputDropzone
            class="page-zone"
            role="group"
            aria-label={f.page.label}
            target="document"
          >
            {f.page.text}
          </FileInputDropzone>
        </FileInput>
      </Show>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Actions">
        {count()}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
