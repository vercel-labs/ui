<script lang="ts">
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { fieldChoiceCardFixture as f, fieldChoiceCardOptions } from "tests/fixtures/field.ts"

  const { alone } = fieldChoiceCardOptions()
</script>

<div class="fixture">
  <button>Before</button>
  {#each f.cards as card (card.name)}
    <FieldLabel class="choice-card">
      <Field>
        <Checkbox class="checkbox" name={card.name}>
          <CheckboxIndicator class="checkbox-indicator" />
        </Checkbox>
        <span>{card.title}</span>
        <FieldDescription>{card.description}</FieldDescription>
      </Field>
    </FieldLabel>
  {/each}
  {#if alone}
    <FieldLabel>{f.alone}</FieldLabel>
  {/if}
  <button>After</button>
</div>
