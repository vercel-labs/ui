import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/solid/file-input"

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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span>{file.name}</span>
              <span data-slot="hint">{formatFileSize(file.size)}</span>
              <FileInputItemRemove>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </FileInputItemRemove>
            </>
          )}
        </FileInputItem>
      </FileInputList>
    </FileInput>
  )
}
