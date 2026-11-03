import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
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
  const [status, setStatus] = React.useState("Closed")

  return (
    <Combobox
      onOpenChange={(open) => setStatus(open ? "Opening…" : "Closing…")}
      onOpenChangeComplete={(open) => setStatus(open ? "Open" : "Closed")}
    >
      <div data-slot="stack">
        <ComboboxLabel>Framework</ComboboxLabel>
        <div data-slot="row">
          <ComboboxInput placeholder="Select a framework" />
          <ComboboxTrigger aria-label="Show frameworks">
            <ChevronDownIcon />
          </ComboboxTrigger>
        </div>
        <output data-slot="output">{status}</output>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList>
          {frameworks.map((framework) => (
            <ComboboxItem key={framework.value} value={framework.value} label={framework.label}>
              {framework.label}
              <ComboboxItemIndicator keepMounted>
                <CheckIcon />
              </ComboboxItemIndicator>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
