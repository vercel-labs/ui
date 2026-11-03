import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/solid/file-input"
import { createSignal } from "solid-js"

export function Example() {
  const [files, setFiles] = createSignal<File[]>([])
  const [last, setLast] = createSignal("Nothing yet")

  return (
    <FileInput
      multiple
      value={files()}
      onValueChange={(value, details) => {
        setFiles(value)
        setLast(`${details.reason}: +${details.added.length} -${details.removed.length}`)
      }}
    >
      <FileInputDropzone>
        <span data-slot="hint">
          {files().length} {files().length === 1 ? "file" : "files"}
        </span>
        <div data-slot="row">
          <FileInputTrigger>Add</FileInputTrigger>
          <button type="button" onClick={() => setFiles(files().slice(0, -1))} disabled={!files().length}>
            Remove last
          </button>
        </div>
      </FileInputDropzone>
      <FileInputList aria-label="Files">
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
      <output data-slot="output">{last()}</output>
    </FileInput>
  )
}
