import {
  createFileInputController,
  FileInput,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  formatFileSize,
} from "@ui-sdk/solid/file-input"

export function Example() {
  const controller = createFileInputController()

  return (
    <div data-slot="stack">
      <div data-slot="row">
        <button type="button" onClick={() => controller.open()}>
          Open the picker
        </button>
        <button
          type="button"
          onClick={() =>
            controller.addFiles([new File(["hello"], `note-${Date.now()}.txt`, { type: "text/plain" })])
          }
        >
          Add a note
        </button>
        <button type="button" onClick={() => controller.clear()}>
          Clear
        </button>
      </div>
      <FileInput multiple controller={controller}>
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
      </FileInput>
    </div>
  )
}
