import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  formatFileSize,
} from "@ui-sdk/react/file-input"
import { FileIcon, UploadIcon, XIcon } from "lucide-react"

export function Example() {
  return (
    <FileInput multiple>
      <p data-slot="hint">Drag a file anywhere over this page.</p>
      <FileInputDropzone target="document" data-variant="overlay">
        <div data-slot="stack">
          <UploadIcon aria-hidden="true" />
          <p>Drop to attach</p>
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
    </FileInput>
  )
}
