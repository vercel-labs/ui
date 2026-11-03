import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/react/file-input"
import { FileIcon, XIcon } from "lucide-react"
import * as React from "react"

const cover = new File(["Dear team,"], "cover-letter.txt", { type: "text/plain" })

export function Example() {
  const id = React.useId()
  const [sent, setSent] = React.useState<string | null>(null)

  return (
    <div data-slot="stack">
      <FileInput name="attachments" form={id} multiple accept="image/*,.pdf,.txt" defaultValue={[cover]}>
        <FileInputDropzone>
          <span data-slot="hint">Images, PDFs and text</span>
          <FileInputTrigger>Attach</FileInputTrigger>
        </FileInputDropzone>
        <FileInputList aria-label="Attachments">
          <FileInputItem>
            {({ file }) => (
              <>
                <FileIcon aria-hidden="true" />
                <span>{file.name}</span>
                <span data-slot="hint">{formatFileSize(file.size)}</span>
                <FileInputItemRemove>
                  <XIcon aria-hidden="true" />
                </FileInputItemRemove>
              </>
            )}
          </FileInputItem>
        </FileInputList>
      </FileInput>
      <form
        id={id}
        onSubmit={(event) => {
          event.preventDefault()
          const files = new FormData(event.currentTarget).getAll("attachments") as File[]
          setSent(
            files
              .filter((file) => file.name)
              .map((file) => file.name)
              .join(", ") || "no files",
          )
        }}
        onReset={() => setSent(null)}
        data-slot="row"
      >
        <button type="submit">Send</button>
        <button type="reset">Reset</button>
        <span data-slot="output">{sent ? `Sent ${sent}.` : ""}</span>
      </form>
    </div>
  )
}
