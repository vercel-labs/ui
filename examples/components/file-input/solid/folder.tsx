import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputList,
  FileInputTrigger,
  relativePath,
} from "@ui-sdk/solid/file-input"

export function Example() {
  return (
    <FileInput directory>
      <FileInputDropzone>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
        <span data-slot="hint">Drop a folder</span>
        <FileInputTrigger>Choose a folder</FileInputTrigger>
      </FileInputDropzone>
      <FileInputList aria-label="Files">
        <FileInputItem>{({ file }) => relativePath(file)}</FileInputItem>
      </FileInputList>
    </FileInput>
  )
}
