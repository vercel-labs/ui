import {
  createNumberInputController,
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/react/number-input"
import { MoveHorizontalIcon } from "lucide-react"
import * as React from "react"

export function Example() {
  const [controller] = React.useState(createNumberInputController)

  return (
    <div data-slot="row" role="toolbar" aria-label="Text">
      <NumberInputScrubArea controller={controller} title="Drag to change the letter spacing">
        <MoveHorizontalIcon aria-hidden="true" />
        <NumberInputScrubAreaCursor>
          <MoveHorizontalIcon aria-hidden="true" />
        </NumberInputScrubAreaCursor>
      </NumberInputScrubArea>
      <NumberInput controller={controller} defaultValue={0} min={-5} max={20} step={0.1}>
        <NumberInputGroup>
          <NumberInputControl aria-label="Letter spacing" />
        </NumberInputGroup>
      </NumberInput>
    </div>
  )
}
