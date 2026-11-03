import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
  type FileRejection,
} from "@ui-sdk/react/file-input"
import { FileIcon, XIcon } from "lucide-react"
import * as React from "react"

const messages: Record<string, string> = {
  "file-too-large": "is too large",
  "file-too-small": "is empty",
  "too-many-files": "is one file too many",
}

export function Example() {
  const [rejected, setRejected] = React.useState<FileRejection[]>([])

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
          <div data-slot="output">
            {rejected.map(({ file, reasons }, index) => (
              <p key={index}>
                {file.name} {reasons.map((reason) => messages[reason] ?? reason).join(" and ")}
              </p>
            ))}
          </div>
        </>
      )}
    </FileInput>
  )
}
