<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"
  import {
    fieldRadiosFixture as f,
    fieldRadiosOptions,
  } from "tests/fixtures/field.ts"

  const { disabledField } = fieldRadiosOptions()
  let firstDisabled = $state(false)
</script>

<div class="fixture">
  <button>Before</button>
  <Field>
    <FieldLabel>{f.label}</FieldLabel>
    <RadioGroup class="form" name={f.name}>
      {#each f.sizes as size, index (size.value)}
        <Field class="row" disabled={index === 0 && disabledField}>
          <Radio
            class="radio"
            value={size.value}
            disabled={index === 0 && firstDisabled}
          >
            <RadioIndicator class="radio-indicator" />
          </Radio>
          <FieldLabel>{size.label}</FieldLabel>
        </Field>
      {/each}
    </RadioGroup>
  </Field>
  <button>After</button>
  <button onclick={() => (firstDisabled = !firstDisabled)}
    >{f.disableFirst}</button
  >
</div>
