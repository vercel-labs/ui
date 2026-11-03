import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover"
import * as React from "react"

const choices = {
  sideOffset: [0, 8, 24],
  alignOffset: [-16, 0, 16],
  collisionPadding: [8, 48],
}

export function Example() {
  const [offsets, setOffsets] = React.useState({ sideOffset: 8, alignOffset: 0, collisionPadding: 8 })

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        {(Object.keys(choices) as (keyof typeof choices)[]).map((name) => (
          <div key={name} data-slot="row" role="group" aria-label={name}>
            {choices[name].map((value) => (
              <button
                key={value}
                type="button"
                data-size="sm"
                aria-pressed={offsets[name] === value}
                onClick={() => setOffsets({ ...offsets, [name]: value })}
              >
                {name} {value}
              </button>
            ))}
          </div>
        ))}
      </div>
      <Popover>
        <PopoverTrigger>Offsets</PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={offsets.sideOffset}
          alignOffset={offsets.alignOffset}
          collisionPadding={offsets.collisionPadding}
        >
          <PopoverTitle>Offsets</PopoverTitle>
          <PopoverDescription>
            {offsets.sideOffset}px from the trigger, shifted {offsets.alignOffset}px,{" "}
            {offsets.collisionPadding}px from the edges.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}
