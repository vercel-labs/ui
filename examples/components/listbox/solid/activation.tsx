import { Listbox, ListboxItem, ListboxItemIcon } from "@ui-sdk/solid/listbox"
import { createSignal, For } from "solid-js"

const files = [
  { value: "readme", label: "README.md" },
  { value: "package", label: "package.json" },
  { value: "tsconfig", label: "tsconfig.json" },
  { value: "index", label: "index.ts" },
  { value: "styles", label: "styles.css" },
  { value: "logo", label: "logo.svg" },
]

function Example() {
  const [value, setValue] = createSignal<string[]>(["readme"])

  return (
    <div data-slot="stack">
      <Listbox multiple activation="automatic" value={value()} onValueChange={setValue} aria-label="Files">
        <For each={files}>
          {(file) => (
            <ListboxItem value={file.value}>
              <ListboxItemIcon>
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
              </ListboxItemIcon>
              {file.label}
            </ListboxItem>
          )}
        </For>
      </Listbox>
      <output data-slot="output">{value().length} selected</output>
    </div>
  )
}

export { Example }
