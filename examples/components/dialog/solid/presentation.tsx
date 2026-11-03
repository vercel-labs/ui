import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"

function Example() {
  return (
    <Dialog presentation="sheet">
      <DialogTrigger>Edit profile</DialogTrigger>
      <DialogContent>
        <div data-slot="stack">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </div>
        <div data-slot="stack">
          <label data-slot="label">
            Name
            <input value="Hollis Grant" />
          </label>
          <label data-slot="label">
            Username
            <input value="@hollis" />
          </label>
        </div>
        <div data-slot="row">
          <DialogClose>Cancel</DialogClose>
          <DialogClose data-variant="solid" value="save">
            Save changes
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { Example }
