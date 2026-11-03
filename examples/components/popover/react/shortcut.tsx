import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverShortcut,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"

const dimensions = [
  { label: "Width", value: "100%" },
  { label: "Max. width", value: "300px" },
  { label: "Height", value: "25px" },
  { label: "Max. height", value: "none" },
]

function Example() {
  return (
    <Popover>
      <PopoverTrigger shortcut="mod+i">
        Dimensions
        <PopoverShortcut />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        <div data-slot="stack">
          {dimensions.map((dimension) => (
            <label data-slot="label" key={dimension.label}>
              {dimension.label}
              <input defaultValue={dimension.value} />
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { Example }
