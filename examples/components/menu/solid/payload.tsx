import {
  createMenuController,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@ui-sdk/solid/menu"
import { createSignal, For } from "solid-js"

type File = { name: string; size: string }

const files: File[] = [
  { name: "Roadmap.pdf", size: "2.4 MB" },
  { name: "Budget.xlsx", size: "860 KB" },
  { name: "Team photo.jpg", size: "5.1 MB" },
]

function Example() {
  const menu = createMenuController<File>()
  const [status, setStatus] = createSignal("")

  return (
    <div data-slot="stack">
      <ul>
        <For each={files}>
          {(file) => (
            <li data-slot="row">
              {file.name}
              <span data-slot="hint">{file.size}</span>
              <MenuTrigger
                controller={menu}
                payload={file}
                aria-label={`Actions for ${file.name}`}
                data-variant="ghost"
                data-size="sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </MenuTrigger>
            </li>
          )}
        </For>
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
      <output data-slot="output">{status() || "Pick a file's actions"}</output>
    </div>
  )
}

export { Example }
