import { FileInput, FileInputDropzone, FileInputTrigger, formatFileSize } from "@ui-sdk/react/file-input"
import { FileIcon } from "lucide-react"

export function Example() {
  return (
    <FileInput accept=".pdf">
      {({ value: [file] }) => (
        <FileInputDropzone>
          <FileIcon aria-hidden="true" />
          <span data-slot="hint">{file ? `${file.name}, ${formatFileSize(file.size)}` : "Drop one PDF"}</span>
          <FileInputTrigger>{file ? "Replace" : "Choose"}</FileInputTrigger>
        </FileInputDropzone>
      )}
    </FileInput>
  )
}
