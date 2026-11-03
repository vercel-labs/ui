<script lang="ts">
  import { MinusIcon, PlusIcon } from "@lucide/svelte"
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    NumberInput,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
    NumberInputControl,
  } from "@ui-sdk/svelte/number-input"

</script>

<Field>
  <FieldLabel>Temperature</FieldLabel>
  <NumberInput defaultValue={-2} min={-20} max={40} format={{ style: 'unit', unit: 'celsius' }}>
    <NumberInputGroup>
      <NumberInputDecrement aria-label="Colder">
        {#snippet render({ props, state })}
          <button {...props} title={state.atBound ? 'As cold as it goes' : 'Colder'}>
            <MinusIcon />
          </button>
        {/snippet}
      </NumberInputDecrement>
      <NumberInputControl>
        {#snippet render({ props, state })}
          <input {...props} />
        {/snippet}
      </NumberInputControl>
      <NumberInputIncrement aria-label="Warmer">
        {#snippet children(state)}
          {#if state.atBound}
            <span>Max</span>
          {:else}
            <PlusIcon />
          {/if}
        {/snippet}
      </NumberInputIncrement>
    </NumberInputGroup>
  </NumberInput>
</Field>
