import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"

const aligns = ["start", "center", "end"] as const

export function Example() {
  return (
    <div data-slot="row">
      {aligns.map((align) => (
        <Popover key={align}>
          <PopoverTrigger>Align {align}</PopoverTrigger>
          <PopoverContent align={align}>
            <PopoverTitle>Aligned to the {align}</PopoverTitle>
            <PopoverDescription>The popover lines up with the trigger's {align}.</PopoverDescription>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
