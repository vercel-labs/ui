import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@ui-sdk/react/field"
import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  type FileInputValueChangeDetails,
  type FileRejection,
} from "@ui-sdk/react/file-input"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  describeChange,
  fileInputFixture as f,
  fileInputOptions,
  serializeFiles,
} from "tests/fixtures/file-input.ts"

function Fixture() {
  const options = fileInputOptions()
  const [action, setAction] = React.useState("")
  const [count, setCount] = React.useState(0)
  const [submitted, setSubmitted] = React.useState("")
  const [attachments, setAttachments] = React.useState<File[]>([])
  const note = React.useRef<HTMLTextAreaElement>(null)
  // A change counts as an action, and shows its rejections too. Rejections
  // without a change only show. Both callbacks run in the same task.
  const changed = React.useRef(false)
  const callbacks = (kind: string) => ({
    onValueChange: (value: File[], details: FileInputValueChangeDetails) => {
      if (options.cancel) {
        details.cancel()
      }
      changed.current = true
      queueMicrotask(() => (changed.current = false))
      setAction(describeChange(kind, details))
      setCount((current) => current + 1)
      const ignored =
        options.ignoreRemovals && details.reason === "remove-press"
      if (kind === "attachments" && !details.canceled && !ignored) {
        setAttachments(value)
      }
    },
    onReject: (rejected: FileRejection[], details: { reason: string }) => {
      if (!changed.current) {
        setAction(describeChange(kind, { ...details, rejected }))
      }
    },
  })

  return (
    <div className="fixture">
      <button>Before</button>
      <form
        className="form"
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
            {...(options.controlled && { value: attachments })}
            {...callbacks("attachments")}
            className="file-input"
          >
            <FileInputDropzone
              className="zone"
              role="group"
              aria-label={f.zone.label}
              pasteTarget={() => note.current}
            >
              {(state) => (
                <>
                  <p>{state.dragging ? f.zone.dragging : f.zone.text}</p>
                  <FileInputTrigger>{f.trigger.label}</FileInputTrigger>
                </>
              )}
            </FileInputDropzone>
            <FileInputList aria-label={f.list.label} className="file-list">
              <FileInputItem className="file-item">
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
          <FieldError className="field-error" match="valueMissing">
            {f.field.error}
          </FieldError>
        </Field>
        <label>
          {f.note.label}
          <textarea ref={note} name={f.note.name} />
        </label>
        <div className="row">
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
      {options.page && (
        <FileInput multiple {...callbacks("page")}>
          <FileInputDropzone
            className="page-zone"
            role="group"
            aria-label={f.page.label}
            target="document"
          >
            {f.page.text}
          </FileInputDropzone>
        </FileInput>
      )}
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Actions">
        {count}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
