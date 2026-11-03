"use client"

import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/react/listbox"
import { CheckIcon } from "lucide-react"
import * as React from "react"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
]

function Example() {
  const [value, setValue] = React.useState<string | null>("astro")

  return (
    <div data-slot="stack">
      <Listbox deselectable value={value} onValueChange={setValue} aria-label="Framework">
        {frameworks.map((framework) => (
          <ListboxItem key={framework.value} value={framework.value}>
            {framework.label}
            <ListboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ListboxItemIndicator>
          </ListboxItem>
        ))}
      </Listbox>
      <output data-slot="output">Value: {value ?? "none"}</output>
    </div>
  )
}

export { Example }
