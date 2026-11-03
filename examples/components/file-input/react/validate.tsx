import {
  createFileInputController,
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
  duplicate: "is already added",
}

export function Example() {
  const [controller] = React.useState(createFileInputController)
  const [rejected, setRejected] = React.useState<FileRejection[]>([])

  return (
    <FileInput
      multiple
      controller={controller}
      validate={(file) =>
        controller.getValue().some((other) => other.name === file.name) ? "duplicate" : null
      }
      onValueChange={() => setRejected([])}
      onReject={setRejected}
    >
      <FileInputDropzone>
        <span data-slot="hint">Each name once</span>
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
            {file.name} {messages[reasons[0]] ?? "was rejected"}
          </p>
        ))}
      </div>
    </FileInput>
  )
}
