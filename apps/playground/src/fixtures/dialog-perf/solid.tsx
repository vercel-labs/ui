import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { render } from "@solidjs/web"
import { For } from "solid-js"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many dialogs on one page, like a delete confirmation in every row of a
// table, for the counts specs. Only the first one is opened.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div class="fixture" style={{ "flex-wrap": "wrap" }}>
      <button>Before</button>
      <For each={items}>
        {(item) => (
          <Dialog>
            <DialogTrigger>Delete {item.label}</DialogTrigger>
            <DialogBackdrop class="dialog-backdrop" />
            <DialogContent class="dialog">
              <DialogTitle class="title">Delete {item.label}?</DialogTitle>
              <DialogDescription class="description">
                This can't be undone.
              </DialogDescription>
              <div class="actions">
                <DialogClose>Cancel</DialogClose>
                <button>Delete</button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </For>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
