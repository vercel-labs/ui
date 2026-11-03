import {
  createFileInputController,
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@ui-sdk/react/file-input"
import { FileIcon, ImageIcon, PlusIcon, XIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [controller] = React.useState(createFileInputController)
  const [text, setText] = React.useState("")
  const input = React.useRef<HTMLTextAreaElement>(null)

  return (
    <FileInput
      multiple
      accept={["image/*", ".pdf", ".txt", ".md"]}
      maxSize={10_000_000}
      controller={controller}
    >
      {(state) => (
        <FileInputDropzone pasteTarget={() => input.current}>
          <FileInputList aria-label="Attachments" data-variant="chips">
            <FileInputItem>
              {({ file }) => (
                <>
                  {file.type.startsWith("image/") ? (
                    <ImageIcon aria-hidden="true" />
                  ) : (
                    <FileIcon aria-hidden="true" />
                  )}
                  <span>{file.name}</span>
                  <FileInputItemRemove>
                    <XIcon aria-hidden="true" />
                  </FileInputItemRemove>
                </>
              )}
            </FileInputItem>
          </FileInputList>
          <textarea
            ref={input}
            aria-label="Message"
            placeholder="Ask anything. Paste or drop files to attach them."
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              const last = state.value.at(-1)
              if (event.key !== "Backspace" || text !== "" || !last) return
              event.preventDefault()
              controller.removeFile(last, { reason: "remove-press" })
            }}
          />
          <div data-slot="row">
            <FileInputTrigger aria-label="Attach files">
              <PlusIcon aria-hidden="true" />
            </FileInputTrigger>
            <button
              type="button"
              disabled={!text && !state.value.length}
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
