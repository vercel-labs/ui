import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/react/file-input"
import { ImageIcon, XIcon } from "lucide-react"

export function Example() {
  return (
    <FileInput
      multiple
      accept="image/*"
      announcement={({ added, removed, rejected }) =>
        [
          added.length && `Added ${added.map((file) => file.name).join(", ")}.`,
          removed.length && `Removed ${removed.map((file) => file.name).join(", ")}.`,
          rejected.length && `${rejected.length} skipped, images only.`,
        ]
          .filter(Boolean)
          .join(" ") || null
      }
    >
      <FileInputDropzone>
        <span data-slot="hint">Images, announced by name</span>
        <FileInputTrigger>Add images</FileInputTrigger>
      </FileInputDropzone>
      <FileInputList aria-label="Images">
        <FileInputItem>
          {({ file }) => (
            <>
              <ImageIcon aria-hidden="true" />
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
