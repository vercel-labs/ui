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

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      <Dialog>
        <DialogTrigger
          className={(state) => (state.open ? "is-open" : "is-closed")}
          render={(props, state) => (
            <button {...props}>
              Shipping <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
            </button>
          )}
        />
        <DialogBackdrop className="dialog-backdrop" render={<section />} />
        <DialogContent
          className={(state) =>
            `dialog ${state.open ? "is-open" : "is-closed"}`
          }
        >
          <DialogTitle render={<h3 />}>Shipping</DialogTitle>
          <DialogDescription render={<div />}>
            Arrives in two days.
          </DialogDescription>
          <DialogClose render={<a href="#done" />}>Done</DialogClose>
        </DialogContent>
      </Dialog>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(<Fixture />)
}

export { mount }
