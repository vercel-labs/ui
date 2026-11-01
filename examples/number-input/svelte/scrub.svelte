<script lang="ts">
  import { MoveHorizontal, MoveVertical } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    NumberInput,
    NumberInputGroup,
    NumberInputControl,
    NumberInputScrubArea,
    NumberInputScrubAreaCursor,
  } from "@ui-sdk/svelte/number-input"

</script>

<div data-slot="row">
  <Field>
    <NumberInput defaultValue={320} min={0}>
      <NumberInputScrubArea pixelsPerStep={2}>
        <FieldLabel>Width</FieldLabel>
        <NumberInputScrubAreaCursor>
          <MoveHorizontal aria-hidden="true" />
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
          <MoveVertical aria-hidden="true" />
        </NumberInputScrubAreaCursor>
      </NumberInputScrubArea>
      <NumberInputGroup>
        <NumberInputControl />
      </NumberInputGroup>
    </NumberInput>
  </Field>
</div>
