import {
  createFileInputController,
  FileInput,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  formatFileSize,
} from "@ui-sdk/react/file-input"
import { FileIcon, XIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [controller] = React.useState(createFileInputController)

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
    </div>
  )
}
