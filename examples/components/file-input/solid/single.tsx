import { FileInput, FileInputDropzone, FileInputTrigger, formatFileSize } from "@ui-sdk/solid/file-input"

export function Example() {
  return (
    <FileInput accept=".pdf">
      {({ value: [file] }) => (
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
            <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
            <path d="M14 2v5a1 1 0 0 0 1 1h5" />
          </svg>
          <span data-slot="hint">{file ? `${file.name}, ${formatFileSize(file.size)}` : "Drop one PDF"}</span>
          <FileInputTrigger>{file ? "Replace" : "Choose"}</FileInputTrigger>
        </FileInputDropzone>
      )}
    </FileInput>
  )
}
