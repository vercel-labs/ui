import { Field, FieldLabel } from "@ui-sdk/solid/field"
import {
  NumberInput,
  NumberInputGroup,
  NumberInputControl,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/solid/number-input"

export function Example() {
  return (
    <div data-slot="row">
      <Field>
        <NumberInput defaultValue={320} min={0}>
          <NumberInputScrubArea pixelsPerStep={2}>
            <FieldLabel>Width</FieldLabel>
            <NumberInputScrubAreaCursor>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="m18 8 4 4-4 4" />
                <path d="M2 12h20" />
                <path d="m6 8-4 4 4 4" />
              </svg>
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2v20" />
                <path d="m8 18 4 4 4-4" />
                <path d="m8 6 4-4 4 4" />
              </svg>
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
