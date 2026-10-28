<script lang="ts">
  import { Field, FieldLabel } from "@ui-sdk/svelte/field"
  import { Radio, RadioGroup, RadioIndicator } from "@ui-sdk/svelte/radio"
  import { fieldRadiosFixture as f } from "tests/fixtures/field.ts"
</script>

<div class="fixture">
  <button>Before</button>
  <Field>
    <FieldLabel>{f.label}</FieldLabel>
    <RadioGroup class="form" name={f.name}>
      {#each f.sizes as size (size.value)}
        <Field class="row">
          <Radio class="radio" value={size.value}>
            <RadioIndicator class="radio-indicator" />
          </Radio>
          <FieldLabel>{size.label}</FieldLabel>
        </Field>
      {/each}
    </RadioGroup>
  </Field>
  <button>After</button>
</div>
