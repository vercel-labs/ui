import { Field, FieldControl, FieldLabel } from "@ui-sdk/solid/field"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"

function Example() {
  return (
    <Popover>
      <PopoverTrigger>Share</PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Share this document</PopoverTitle>
        <PopoverDescription>Anyone with the link can view it.</PopoverDescription>
        <Field>
          <FieldLabel>Link</FieldLabel>
          <FieldControl readonly defaultValue="acme.app/d/q3-roadmap" />
        </Field>
        <div data-slot="row">
          <PopoverClose>Cancel</PopoverClose>
          <PopoverClose data-variant="solid">Copy Link</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Example }
