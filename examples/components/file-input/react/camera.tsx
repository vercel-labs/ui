import { FileInput, FileInputTrigger } from "@ui-sdk/react/file-input"
import { SmartphoneIcon } from "lucide-react"

export function Example() {
  return (
    <FileInput accept="image/*" capture="environment">
      {(state) => (
        <>
          <FileInputTrigger>
            <SmartphoneIcon aria-hidden="true" />
            Take a photo
          </FileInputTrigger>
          <span data-slot="hint">{state.value[0]?.name ?? "No photo yet"}</span>
        </>
      )}
    </FileInput>
  )
}
