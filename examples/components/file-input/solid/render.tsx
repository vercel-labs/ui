import {
  FileInput,
  FileInputDropzone,
  FileInputItem,
  FileInputItemRemove,
  FileInputList,
  FileInputTrigger,
} from "@ui-sdk/solid/file-input"
import { Show } from "solid-js"

export function Example() {
  return (
    <FileInput multiple accept="image/*" maxFiles={4}>
      <FileInputDropzone render={(props) => <section {...props} aria-label="Gallery upload" />}>
        {(state) => (
          <>
            {state.dragReject ? (
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
            ) : state.dragAccept ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
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
            )}
            <p>
              {state.dragReject
                ? "Only up to 4 images"
                : state.dragAccept
                  ? "Release to add"
                  : "Drag up to 4 images here"}
            </p>
            <Show when={!state.dragging}>
              <FileInputTrigger>Browse</FileInputTrigger>
            </Show>
          </>
        )}
      </FileInputDropzone>
      <FileInputList render={(props) => <ul {...props} aria-label="Images" />} data-variant="chips">
        <FileInputItem render={(props) => <li {...props} />}>
          {(state) => (
            <>
              <Show when={state.index === 0}>
                <span data-show="first">Cover:</span>
              </Show>
              <span>{state.file.name}</span>
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
