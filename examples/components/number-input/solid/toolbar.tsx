import {
  createNumberInputController,
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
  NumberInputScrubAreaCursor,
} from "@ui-sdk/solid/number-input"

export function Example() {
  const controller = createNumberInputController()

  return (
    <div data-slot="row" role="toolbar" aria-label="Text">
      <NumberInputScrubArea controller={controller} title="Drag to change the letter spacing">
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
      <NumberInput controller={controller} defaultValue={0} min={-5} max={20} step={0.1}>
        <NumberInputGroup>
          <NumberInputControl aria-label="Letter spacing" />
        </NumberInputGroup>
      </NumberInput>
    </div>
  )
}
