"use client"

import * as React from "react"
import {
  createMenuController,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/react/menu"
import { EllipsisIcon } from "lucide-react"

type File = { name: string; size: string }

const files: File[] = [
  { name: "Roadmap.pdf", size: "2.4 MB" },
  { name: "Budget.xlsx", size: "860 KB" },
  { name: "Team photo.jpg", size: "5.1 MB" },
]

function Example() {
  const [menu] = React.useState(() => createMenuController<File>())
  const [status, setStatus] = React.useState("")

  return (
    <div data-slot="stack">
      <ul>
        {files.map((file) => (
          <li key={file.name} data-slot="row">
            {file.name}
            <span data-slot="hint">{file.size}</span>
            <MenuTrigger
              controller={menu}
              payload={file}
              aria-label={`Actions for ${file.name}`}
              data-variant="ghost"
              data-size="sm"
            >
              <EllipsisIcon aria-hidden="true" />
            </MenuTrigger>
          </li>
        ))}
      </ul>
      <Menu controller={menu} onAction={(action) => setStatus(`${action} ${menu.getPayload()?.name}`)}>
        <MenuContent<File> align="end">
          {(state) => (
            <>
              <MenuGroup>
                <MenuGroupLabel>{state.payload?.name}</MenuGroupLabel>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="rename">Rename</MenuItem>
                <MenuItem value="duplicate">Duplicate</MenuItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuItem value="delete">Delete</MenuItem>
            </>
          )}
        </MenuContent>
      </Menu>
      <button
        data-variant="ghost"
        onClick={async (event) => {
          const result = await menu.open({ payload: files[0], anchor: event.currentTarget })
          setStatus(`Closed with ${result.reason}`)
        }}
      >
        Open for {files[0].name}
      </button>
      <output data-slot="output">{status || "Pick a file's actions"}</output>
    </div>
  )
}

export { Example }
