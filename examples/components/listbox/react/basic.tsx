"use client"

import { Field, FieldLabel } from "@ui-sdk/react/field"
import { Listbox, ListboxItem, ListboxItemIndicator } from "@ui-sdk/react/listbox"
import { CheckIcon } from "lucide-react"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "nuxt", label: "Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
]

function Example() {
  return (
    <Field>
      <FieldLabel>Framework</FieldLabel>
      <Listbox defaultValue="next">
        {frameworks.map((framework) => (
          <ListboxItem key={framework.value} value={framework.value}>
            {framework.label}
            <ListboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ListboxItemIndicator>
          </ListboxItem>
        ))}
      </Listbox>
    </Field>
  )
}

export { Example }
