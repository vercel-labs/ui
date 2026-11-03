import {
  Combobox,
  ComboboxArrow,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from "@ui-sdk/solid/combobox"
import { createSignal, For } from "solid-js"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "solidstart", label: "SolidStart" },
  { value: "qwik", label: "Qwik City" },
]

const sides = ["top", "right", "bottom", "left"] as const
const aligns = ["start", "center", "end"] as const

export function Example() {
  const [side, setSide] = createSignal<(typeof sides)[number]>("bottom")
  const [align, setAlign] = createSignal<(typeof aligns)[number]>("start")
  const [box, setBox] = createSignal<HTMLDivElement | null>(null)
  const [anchored, setAnchored] = createSignal(false)

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div role="group" aria-label="Side" data-slot="row">
          <For each={sides}>
            {(value) => (
              <button
                type="button"
                aria-pressed={side() === value ? "true" : "false"}
                onClick={() => setSide(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
        <div role="group" aria-label="Align" data-slot="row">
          <For each={aligns}>
            {(value) => (
              <button
                type="button"
                aria-pressed={align() === value ? "true" : "false"}
                onClick={() => setAlign(value)}
              >
                {value}
              </button>
            )}
          </For>
        </div>
        <label data-slot="label">
          <input
            type="checkbox"
            checked={anchored()}
            onChange={(event) => setAnchored(event.currentTarget.checked)}
          />
          Anchor to the box
        </label>
      </div>
      <div ref={setBox} data-slot="card">
        <Combobox>
          <ComboboxInput aria-label="Framework" placeholder="Framework" />
          <ComboboxContent
            side={side()}
            align={align()}
            sideOffset={10}
            alignOffset={0}
            collisionPadding={16}
            anchor={anchored() ? box() : null}
          >
            <ComboboxArrow />
            <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
            <ComboboxList>
              <For each={frameworks}>
                {(framework) => (
                  <ComboboxItem value={framework.value} label={framework.label}>
                    {framework.label}
                    <ComboboxItemIndicator>
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
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                )}
              </For>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  )
}
