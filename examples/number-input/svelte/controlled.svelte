<script lang="ts">
  import { Minus, Plus } from "@lucide/svelte"
  import type { NumberInputValueChangeReason } from "@ui-sdk/core/number-input"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    NumberInput,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputControl,
  } from "@ui-sdk/svelte/number-input"

  let value = $state<number | null>(4)
  let committed = $state("")

  function onCommit(next: number | null, details: { reason: NumberInputValueChangeReason }) {
    committed = `${next ?? "empty"}, after ${details.reason}`
  }
</script>

<div data-slot="stack">
  <Field>
    <FieldLabel>Servings</FieldLabel>
    <NumberInput bind:value={value} min={1} max={12} onValueCommit={onCommit}>
      <NumberInputGroup>
        <NumberInputDecrement aria-label="Decrease">
          <Minus aria-hidden="true" />
        </NumberInputDecrement>
        <NumberInputControl />
        <NumberInputIncrement aria-label="Increase">
          <Plus aria-hidden="true" />
        </NumberInputIncrement>
      </NumberInputGroup>
    </NumberInput>
  </Field>
  <div data-slot="row">
    <button type="button" onclick={() => (value = 4)}>
      Reset to 4
    </button>
    <button type="button" onclick={() => (value = null)}>
      Clear
    </button>
  </div>
  <output data-slot="output">
    <span>Value: {value ?? "empty"}</span>
    <span>Committed: {committed || "nothing yet"}</span>
  </output>
</div>
