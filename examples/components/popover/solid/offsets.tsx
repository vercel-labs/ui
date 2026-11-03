import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/solid/popover"
import { createSignal, For } from "solid-js"

const choices = {
  sideOffset: [0, 8, 24],
  alignOffset: [-16, 0, 16],
  collisionPadding: [8, 48],
}

export function Example() {
  const [offsets, setOffsets] = createSignal({ sideOffset: 8, alignOffset: 0, collisionPadding: 8 })

  return (
    <div data-slot="stack">
      <div data-slot="stack">
        <For each={Object.keys(choices) as (keyof typeof choices)[]}>
          {(name) => (
            <div data-slot="row" role="group" aria-label={name}>
              <For each={choices[name]}>
                {(value) => (
                  <button
                    type="button"
                    data-size="sm"
                    aria-pressed={offsets()[name] === value ? "true" : "false"}
                    onClick={() => setOffsets({ ...offsets(), [name]: value })}
                  >
                    {name} {value}
                  </button>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <Popover>
        <PopoverTrigger>Offsets</PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={offsets().sideOffset}
          alignOffset={offsets().alignOffset}
          collisionPadding={offsets().collisionPadding}
        >
          <PopoverTitle>Offsets</PopoverTitle>
          <PopoverDescription>
            {offsets().sideOffset}px from the trigger, shifted {offsets().alignOffset}px,{" "}
            {offsets().collisionPadding}px from the edges.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </div>
  )
}
