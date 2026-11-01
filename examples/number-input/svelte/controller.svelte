<script lang="ts">
  import { ZoomIn, ZoomOut } from "@lucide/svelte"
  import {
    createNumberInputController,
    NumberInput,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputControl,
  } from "@ui-sdk/svelte/number-input"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"

  const zoom = createNumberInputController()
  let reading = $state("")
</script>

<div data-slot="stack">
  <Field>
    <FieldLabel>Zoom</FieldLabel>
    <NumberInput defaultValue={100} min={10} max={400} step={10} controller={zoom}>
      <NumberInputGroup>
        <NumberInputDecrement aria-label="Zoom out">
          <ZoomOut aria-hidden="true" />
        </NumberInputDecrement>
        <NumberInputControl />
        <NumberInputIncrement aria-label="Zoom in">
          <ZoomIn aria-hidden="true" />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInput>
  </Field>
  <div data-slot="row">
    <button type="button" onclick={() => (zoom.decrement({ large: true }))}>
      −100
    </button>
    <button type="button" onclick={() => (zoom.increment())}>
      +10
    </button>
    <button type="button" onclick={() => (zoom.setValue(100))}>
      Actual size
    </button>
    <button type="button" onclick={() => (reading = `Zoom is ${zoom.getValue()}.`)}>
      Read
    </button>
    <button type="button" onclick={() => (zoom.focus())}>
      Focus
    </button>
  </div>
  <output data-slot="output">{reading}</output>
</div>
