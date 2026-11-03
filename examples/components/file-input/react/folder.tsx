import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputList,
  FileInputTrigger,
  relativePath,
} from "@ui-sdk/react/file-input"
import { FolderIcon } from "lucide-react"

export function Example() {
  return (
    <FileInput directory>
      <FileInputDropzone>
        <FolderIcon aria-hidden="true" />
        <span data-slot="hint">Drop a folder</span>
        <FileInputTrigger>Choose a folder</FileInputTrigger>
      </FileInputDropzone>
      <FileInputList aria-label="Files">
        <FileInputItem>{({ file }) => relativePath(file)}</FileInputItem>
      </FileInputList>
    </FileInput>
  )
}
