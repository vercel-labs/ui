<script lang="ts">
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import {
    fieldChoiceCardFixture as f,
    fieldChoiceCardOptions,
  } from "tests/fixtures/field.ts"

  const { alone, later } = fieldChoiceCardOptions()
  let ready = $state(false)
  $effect(() => {
    const timer = setTimeout(() => (ready = true), f.later.delay)
    return () => clearTimeout(timer)
  })
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
  {#if later}
    <FieldLabel class="choice-card">
      <Field>
        {#if ready}
          <Checkbox class="checkbox" name={f.later.name}>
            <CheckboxIndicator class="checkbox-indicator" />
          </Checkbox>
        {/if}
        <span>{f.later.title}</span>
        <FieldDescription>{f.later.description}</FieldDescription>
      </Field>
    </FieldLabel>
  {/if}
  {#if alone}
    <FieldLabel>{f.alone}</FieldLabel>
  {/if}
  <button>After</button>
</div>
