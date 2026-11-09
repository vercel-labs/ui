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

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Dialog>
        <DialogTrigger
          class={(state) => (state.open ? "is-open" : "is-closed")}
          render={(props, state) => (
            <button {...props}>
              Shipping <span aria-hidden="true">{state.open ? "▲" : "▼"}</span>
            </button>
          )}
        />
        <DialogBackdrop
          class="dialog-backdrop"
          render={(props) => <section {...props} />}
        />
        <DialogContent
          class={(state) => `dialog ${state.open ? "is-open" : "is-closed"}`}
        >
          <DialogTitle render={(props) => <h3 {...props} />}>
            Shipping
          </DialogTitle>
          <DialogDescription render={(props) => <div {...props} />}>
            Arrives in two days.
          </DialogDescription>
          <DialogClose render={(props) => <a {...props} href="#done" />}>
            Done
          </DialogClose>
        </DialogContent>
      </Dialog>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { mount }
