import { Field, FieldLabel } from "@ui-sdk/react/field"
import {
  NumberInput,
  NumberInputGroup,
  NumberInputControl,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/react/number-input"
import { MoveHorizontalIcon, MoveVerticalIcon } from "lucide-react"

export function Example() {
  return (
    <div data-slot="row">
      <Field>
        <NumberInput defaultValue={320} min={0}>
          <NumberInputScrubArea pixelsPerStep={2}>
            <FieldLabel>Width</FieldLabel>
            <NumberInputScrubAreaCursor>
              <MoveHorizontalIcon aria-hidden="true" />
            </NumberInputScrubAreaCursor>
          </NumberInputScrubArea>
          <NumberInputGroup>
            <NumberInputControl />
          </NumberInputGroup>
        </NumberInput>
      </Field>
      <Field>
        <NumberInput defaultValue={240} min={0}>
          <NumberInputScrubArea orientation="vertical" pixelsPerStep={2}>
            <FieldLabel>Height</FieldLabel>
            <NumberInputScrubAreaCursor>
              <MoveVerticalIcon aria-hidden="true" />
            </NumberInputScrubAreaCursor>
          </NumberInputScrubArea>
          <NumberInputGroup>
            <NumberInputControl />
          </NumberInputGroup>
        </NumberInput>
      </Field>
    </div>
  )
}
