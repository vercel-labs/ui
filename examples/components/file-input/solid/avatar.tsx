import { FileInput, FileInputDropzone, FileInputTrigger } from "@ui-sdk/solid/file-input"
import { createMemo, createSignal, onCleanup, Show } from "solid-js"

export function Example() {
  const [value, setValue] = createSignal<File[]>([])

  const url = createMemo(() => {
    const file = value()[0]
    if (!file) return null
    const next = URL.createObjectURL(file)
    onCleanup(() => URL.revokeObjectURL(next))
    return next
  })

  return (
    <FileInput accept="image/*" maxSize={5_000_000} value={value()} onValueChange={setValue}>
      <FileInputDropzone data-variant="avatar">
        <Show
          when={url()}
          fallback={
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        >
          {(url) => <img src={url()} alt="" />}
        </Show>
      </FileInputDropzone>
      <div data-slot="stack">
        <div data-slot="row">
          <FileInputTrigger>{url() ? "Change photo" : "Upload photo"}</FileInputTrigger>
          <Show when={url()}>
            <button type="button" onClick={() => setValue([])}>
              Remove
            </button>
          </Show>
        </div>
        <p data-slot="hint">Or drop an image on the avatar. Up to 5 MB.</p>
      </div>
    </FileInput>
  )
}
