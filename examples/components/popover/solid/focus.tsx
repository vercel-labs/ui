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
    <div data-slot="row">
      <Popover>
        <PopoverTrigger>First field</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Rename</PopoverTitle>
          <label data-slot="label">
            Name
            <input value="Quarterly report" />
          </label>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>Specific element</PopoverTrigger>
        <PopoverContent initialFocus="[data-confirm]">
          <PopoverTitle>Apply changes?</PopoverTitle>
          <PopoverDescription>Focus starts on Apply, not Cancel.</PopoverDescription>
          <div data-slot="row">
            <PopoverClose>Cancel</PopoverClose>
            <PopoverClose data-confirm="" data-variant="solid">
              Apply
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>No focus change</PopoverTrigger>
        <PopoverContent initialFocus="none" finalFocus="none">
          <PopoverTitle>Status</PopoverTitle>
          <PopoverDescription>All systems are running.</PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export { Example }
