import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@ui-sdk/react/file-input"
import { CheckIcon, ImageIcon, XIcon } from "lucide-react"

export function Example() {
  return (
    <FileInput multiple accept="image/*" maxFiles={4}>
      <FileInputDropzone render={<section aria-label="Gallery upload" />}>
        {(state) => (
          <>
            {state.dragReject ? <XIcon /> : state.dragAccept ? <CheckIcon /> : <ImageIcon />}
            <p>
              {state.dragReject
                ? "Only up to 4 images"
                : state.dragAccept
                  ? "Release to add"
                  : "Drag up to 4 images here"}
            </p>
            {!state.dragging && <FileInputTrigger>Browse</FileInputTrigger>}
          </>
        )}
      </FileInputDropzone>
      <FileInputList render={<ul aria-label="Images" />} data-variant="chips">
        <FileInputItem render={<li />}>
          {(state) => (
            <>
              {state.index === 0 && <span data-show="first">Cover:</span>}
              <span>{state.file.name}</span>
              <FileInputItemRemove>
                <XIcon />
              </FileInputItemRemove>
            </>
          )}
        </FileInputItem>
      </FileInputList>
    </FileInput>
  )
}
