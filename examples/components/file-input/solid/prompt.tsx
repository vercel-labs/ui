import {
  createFileInputController,
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@ui-sdk/solid/file-input"
import { createSignal } from "solid-js"

export function Example() {
  const controller = createFileInputController()
  const [text, setText] = createSignal("")
  let input: HTMLTextAreaElement | undefined

  return (
    <FileInput
      multiple
      accept={["image/*", ".pdf", ".txt", ".md"]}
      maxSize={10_000_000}
      controller={controller}
    >
      {(state) => (
        <FileInputDropzone pasteTarget={() => input}>
          <FileInputList aria-label="Attachments" data-variant="chips">
            <FileInputItem>
              {({ file }) => (
                <>
                  {file.type.startsWith("image/") ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                  ) : (
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
                  )}
                  <span>{file.name}</span>
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
          <textarea
            ref={input}
            aria-label="Message"
            placeholder="Ask anything. Paste or drop files to attach them."
            value={text()}
            onInput={(event) => setText(event.currentTarget.value)}
            onKeyDown={(event) => {
              const last = state.value.at(-1)
              if (event.key !== "Backspace" || text() !== "" || !last) return
              event.preventDefault()
              controller.removeFile(last, { reason: "remove-press" })
            }}
          />
          <div data-slot="row">
            <FileInputTrigger aria-label="Attach files">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </FileInputTrigger>
            <button
              type="button"
              disabled={!text() && !state.value.length}
              onClick={() => {
                setText("")
                controller.clear()
              }}
            >
              Send
            </button>
          </div>
        </FileInputDropzone>
      )}
    </FileInput>
  )
}
