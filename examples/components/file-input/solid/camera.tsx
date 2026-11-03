import { FileInput, FileInputTrigger } from "@ui-sdk/solid/file-input"

export function Example() {
  return (
    <FileInput accept="image/*" capture="environment">
      {(state) => (
        <>
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
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
            Take a photo
          </FileInputTrigger>
          <span data-slot="hint">{state.value[0]?.name ?? "No photo yet"}</span>
        </>
      )}
    </FileInput>
  )
}
