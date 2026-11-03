"use client"

import { Listbox, ListboxItem, ListboxItemIcon } from "@ui-sdk/react/listbox"
import { FileIcon } from "lucide-react"
import * as React from "react"

const files = [
  { value: "readme", label: "README.md" },
  { value: "package", label: "package.json" },
  { value: "tsconfig", label: "tsconfig.json" },
  { value: "index", label: "index.ts" },
  { value: "styles", label: "styles.css" },
  { value: "logo", label: "logo.svg" },
]

function Example() {
  const [value, setValue] = React.useState<string[]>(["readme"])

  return (
    <div data-slot="stack">
      <Listbox multiple activation="automatic" value={value} onValueChange={setValue} aria-label="Files">
        {files.map((file) => (
          <ListboxItem key={file.value} value={file.value}>
            <ListboxItemIcon>
              <FileIcon aria-hidden="true" />
            </ListboxItemIcon>
            {file.label}
          </ListboxItem>
        ))}
      </Listbox>
      <output data-slot="output">{value.length} selected</output>
    </div>
  )
}

export { Example }
