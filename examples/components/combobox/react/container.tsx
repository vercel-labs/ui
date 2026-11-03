import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
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

export function Example() {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null)

  return (
    <div data-slot="stack">
      <Combobox container={container}>
        <div data-slot="row">
          <ComboboxInput aria-label="Framework" placeholder="Select a framework" />
          <ComboboxTrigger aria-label="Show frameworks">
            <ChevronDownIcon />
          </ComboboxTrigger>
        </div>
        <ComboboxContent>
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
      <div data-slot="card">
        Container
        <div ref={setContainer} />
      </div>
    </div>
  )
}
