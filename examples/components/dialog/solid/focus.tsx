import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"

function Example() {
  let next: HTMLButtonElement | undefined
  return (
    <div data-slot="row">
      <Dialog>
        <DialogTrigger>Invite</DialogTrigger>
        <DialogBackdrop />
        <DialogContent initialFocus="[name=email]" finalFocus={() => next}>
          <div data-slot="stack">
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>Focus starts on the email.</DialogDescription>
          </div>
          <div data-slot="stack">
            <label data-slot="label">
              Name
              <input name="name" value="Ada" />
            </label>
            <label data-slot="label">
              Email
              <input name="email" type="email" />
            </label>
          </div>
          <div data-slot="row">
            <DialogClose data-variant="solid">Send invite</DialogClose>
          </div>
        </DialogContent>
      </Dialog>
      <button ref={next} type="button">
        Next step
      </button>
    </div>
  )
}

export { Example }
