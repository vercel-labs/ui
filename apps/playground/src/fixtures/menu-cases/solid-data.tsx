import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { Menu, MenuTrigger } from "@ui-sdk/solid/menu"
import { render } from "@solidjs/web"
import { createSignal } from "solid-js"
import { casesData } from "./data"

function Fixture() {
  const [action, setAction] = createSignal("")
  const [align, setAlign] = createSignal("left")
  const [journal, setJournal] = createSignal(false)
  const [shortcuts, setShortcuts] = createSignal(true)
  return (
    <div class="fixture">
      <button>Before</button>
      <Menu
        items={casesData({ align: align(), journal: journal() })}
        itemShortcuts={shortcuts()}
        onAction={setAction}
      >
        <MenuTrigger>Edit</MenuTrigger>
      </Menu>
      <button onClick={() => setAlign("right")}>Align right</button>
      <button onClick={() => setJournal(true)}>Add journal</button>
      <button onClick={() => setShortcuts(false)}>Turn off shortcuts</button>
      <button>After</button>
      <input aria-label="Notes" />
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent class="dialog">
          <DialogTitle class="title">Settings</DialogTitle>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
