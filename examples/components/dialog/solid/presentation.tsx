import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { Field, FieldControl, FieldLabel } from "@ui-sdk/solid/field"

function Example() {
  return (
    <Dialog presentation="sheet">
      <DialogTrigger>Edit Profile</DialogTrigger>
      <DialogContent>
        <div data-slot="stack">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here. Save when you're done.</DialogDescription>
        </div>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <FieldControl defaultValue="Hollis Grant" />
        </Field>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <FieldControl defaultValue="@hollis" />
        </Field>
        <div data-slot="row">
          <DialogClose>Cancel</DialogClose>
          <DialogClose data-variant="solid" value="save">
            Save Changes
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { Example }
