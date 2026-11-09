import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import { createRoot } from "react-dom/client"
import { perfItems, perfSize } from "tests/fixtures/perf.ts"

// Many dialogs on one page, like a delete confirmation in every row of a
// table, for the counts specs. Only the first one is opened.
const items = perfItems(perfSize())

function Fixture() {
  return (
    <div className="fixture" style={{ flexWrap: "wrap" }}>
      <button>Before</button>
      {items.map((item) => (
        <Dialog key={item.value}>
          <DialogTrigger>Delete {item.label}</DialogTrigger>
          <DialogBackdrop className="dialog-backdrop" />
          <DialogContent className="dialog">
            <DialogTitle className="title">Delete {item.label}?</DialogTitle>
            <DialogDescription className="description">
              This can't be undone.
            </DialogDescription>
            <div className="actions">
              <DialogClose>Cancel</DialogClose>
              <button>Delete</button>
            </div>
          </DialogContent>
        </Dialog>
      ))}
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
