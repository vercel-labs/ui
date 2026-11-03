import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@ui-sdk/react/menu"
import { ArchiveIcon, CopyIcon, PencilIcon, TrashIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [action, setAction] = React.useState("")

  return (
    <div data-slot="stack">
      <Menu onAction={setAction}>
        <MenuTrigger>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem value="edit">
            <PencilIcon />
            Edit
          </MenuItem>
          <MenuItem value="duplicate">
            <CopyIcon />
            Duplicate
          </MenuItem>
          <MenuItem value="archive">
            <ArchiveIcon />
            Archive
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="delete" destructive>
            <TrashIcon />
            Delete
          </MenuItem>
        </MenuContent>
      </Menu>
      <output data-slot="output">{action ? `Ran ${action}` : "Pick an item"}</output>
    </div>
  )
}
