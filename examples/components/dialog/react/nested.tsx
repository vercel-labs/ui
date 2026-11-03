import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"

function Example() {
  return (
    <Dialog>
      <DialogTrigger>Account</DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <div data-slot="stack">
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>Manage how you sign in.</DialogDescription>
        </div>
        <div data-slot="row">
          <Dialog>
            <DialogTrigger>Change password</DialogTrigger>
            <DialogBackdrop />
            <DialogContent>
              <div data-slot="stack">
                <DialogTitle>Change password</DialogTitle>
                <DialogDescription>Use at least 12 characters.</DialogDescription>
              </div>
              <label data-slot="label">
                New password
                <input type="password" />
              </label>
              <div data-slot="row">
                <DialogClose>Cancel</DialogClose>
                <DialogClose data-variant="solid">Update</DialogClose>
              </div>
            </DialogContent>
          </Dialog>
          <DialogClose data-variant="solid">Done</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { Example }
