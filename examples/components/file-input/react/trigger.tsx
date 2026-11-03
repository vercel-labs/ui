import { FileInput, FileInputTrigger } from "@ui-sdk/react/file-input"
import { UploadIcon } from "lucide-react"

export function Example() {
  return (
    <FileInput>
      {(state) => (
        <>
          <FileInputTrigger>
            <UploadIcon aria-hidden="true" />
            Upload a file
          </FileInputTrigger>
          <span data-slot="hint">{state.value[0]?.name ?? "No file chosen"}</span>
        </>
      )}
    </FileInput>
  )
}
