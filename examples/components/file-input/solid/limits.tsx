import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
  type FileRejection,
} from "@ui-sdk/solid/file-input"
import { createSignal, For } from "solid-js"

const messages: Record<string, string> = {
  "file-too-large": "is too large",
  "file-too-small": "is empty",
  "too-many-files": "is one file too many",
}

export function Example() {
  const [rejected, setRejected] = createSignal<FileRejection[]>([])

  return (
    <FileInput
      multiple
      maxFiles={3}
      maxSize={5_000_000}
      minSize={1}
      onValueChange={() => setRejected([])}
      onReject={setRejected}
    >
      {(state) => (
        <>
          <FileInputDropzone>
            <span data-slot="hint">{state.value.length} of 3 files, up to 5 MB each</span>
            <FileInputTrigger>Add files</FileInputTrigger>
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
          <div data-slot="output">
            <For each={rejected()}>
              {({ file, reasons }) => (
                <p>
                  {file.name} {reasons.map((reason) => messages[reason] ?? reason).join(" and ")}
                </p>
              )}
            </For>
          </div>
        </>
      )}
    </FileInput>
  )
}
