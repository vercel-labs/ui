import {
  FileInput,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
  formatFileSize,
} from "@ui-sdk/solid/file-input"
import { createMemo, onCleanup } from "solid-js"

export function Example() {
  return (
    <FileInput multiple accept="image/*">
      <FileInputTrigger>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
        Add images
      </FileInputTrigger>
      <FileInputList aria-label="Images" data-variant="grid">
        <FileInputItem>
          {({ file, index }) => (
            <>
              <Preview file={file} />
              <span>
                {index + 1}. {file.name}, {formatFileSize(file.size)}
              </span>
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

function Preview(props: { file: File }) {
  const url = createMemo(() => {
    const next = URL.createObjectURL(props.file)
    onCleanup(() => URL.revokeObjectURL(next))
    return next
  })
  return <img src={url()} alt="" />
}
