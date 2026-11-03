import {
  Combobox,
  ComboboxArrow,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
} from "@ui-sdk/react/combobox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

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
  const [side, setSide] = React.useState<(typeof sides)[number]>("bottom")
  const [align, setAlign] = React.useState<(typeof aligns)[number]>("start")
  const [box, setBox] = React.useState<HTMLDivElement | null>(null)
  const [anchored, setAnchored] = React.useState(false)

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <div role="group" aria-label="Side" data-slot="row">
          {sides.map((value) => (
            <button key={value} type="button" aria-pressed={side === value} onClick={() => setSide(value)}>
              {value}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Align" data-slot="row">
          {aligns.map((value) => (
            <button key={value} type="button" aria-pressed={align === value} onClick={() => setAlign(value)}>
              {value}
            </button>
          ))}
        </div>
        <label data-slot="label">
          <input
            type="checkbox"
            checked={anchored}
            onChange={(event) => setAnchored(event.currentTarget.checked)}
          />
          Anchor to the box
        </label>
      </div>
      <div ref={setBox} data-slot="card">
        <Combobox>
          <ComboboxInput aria-label="Framework" placeholder="Framework" />
          <ComboboxContent
            side={side}
            align={align}
            sideOffset={10}
            alignOffset={0}
            collisionPadding={16}
            anchor={anchored ? box : null}
          >
            <ComboboxArrow />
            <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
            <ComboboxList>
              {frameworks.map((framework) => (
                <ComboboxItem key={framework.value} value={framework.value} label={framework.label}>
                  {framework.label}
                  <ComboboxItemIndicator>
                    <CheckIcon />
                  </ComboboxItemIndicator>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  )
}
