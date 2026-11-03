import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/solid/file-input"
import { createSignal, createUniqueId } from "solid-js"

const cover = new File(["Dear team,"], "cover-letter.txt", { type: "text/plain" })

export function Example() {
  const id = createUniqueId()
  const [sent, setSent] = createSignal<string | null>(null)

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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                  <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                </svg>
                <span>{file.name}</span>
                <span data-slot="hint">{formatFileSize(file.size)}</span>
                <FileInputItemRemove>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
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
        <span data-slot="output">{sent() ? `Sent ${sent()}.` : ""}</span>
      </form>
    </div>
  )
}
