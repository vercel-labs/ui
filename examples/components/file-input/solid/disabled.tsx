import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/solid/file-input"

export function Example() {
  return (
    <FileInput disabled>
      <FileInputDropzone>
        <span data-slot="hint">Uploads are paused</span>
        <FileInputTrigger>Browse</FileInputTrigger>
      </FileInputDropzone>
    </FileInput>
  )
}
