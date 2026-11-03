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
import { FileIcon, ImageIcon, XIcon } from "lucide-react"
import * as React from "react"

const messages: Record<string, string> = {
  "file-type": "isn't a supported type",
}

export function Example() {
  const [rejected, setRejected] = React.useState<FileRejection[]>([])

  return (
    <FileInput
      multiple
      accept={["image/*", ".pdf"]}
      onValueChange={() => setRejected([])}
      onReject={setRejected}
    >
      <FileInputDropzone>
        <ImageIcon aria-hidden="true" />
        <span data-slot="hint">Images and PDFs</span>
        <FileInputTrigger>Browse</FileInputTrigger>
      </FileInputDropzone>
      <FileInputList aria-label="Files">
        <FileInputItem>
          {({ file }) => (
            <>
              {file.type.startsWith("image/") ? (
                <ImageIcon aria-hidden="true" />
              ) : (
                <FileIcon aria-hidden="true" />
              )}
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
