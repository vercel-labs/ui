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

export function Example() {
  const [files, setFiles] = React.useState<File[]>([])
  const [last, setLast] = React.useState("Nothing yet")

  return (
    <FileInput
      multiple
      value={files}
      onValueChange={(value, details) => {
        setFiles(value)
        setLast(`${details.reason}: +${details.added.length} -${details.removed.length}`)
      }}
    >
      <FileInputDropzone>
        <span data-slot="hint">
          {files.length} {files.length === 1 ? "file" : "files"}
        </span>
        <div data-slot="row">
          <FileInputTrigger>Add</FileInputTrigger>
          <button type="button" onClick={() => setFiles(files.slice(0, -1))} disabled={!files.length}>
            Remove last
          </button>
        </div>
      </FileInputDropzone>
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
      <output data-slot="output">{last}</output>
    </FileInput>
  )
}
