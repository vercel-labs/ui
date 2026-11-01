<script lang="ts">
  import { Check } from "@lucide/svelte"
  import { Checkbox, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"

  const options = [
    { name: "backups", title: "Daily backups", description: "Keep a copy of every database each night." },
    { name: "alerts", title: "Usage alerts", description: "Email the team when usage passes its limit." },
  ]
</script>

<div data-slot="stack">
  {#each options as option (option.name)}
    <FieldLabel data-variant="card">
      <Field>
        <Checkbox name={option.name}>
          <CheckboxIndicator>
            <Check />
          </CheckboxIndicator>
        </Checkbox>
        <span data-slot="stack">
          <span>{option.title}</span>
          <FieldDescription>{option.description}</FieldDescription>
        </span>
      </Field>
    </FieldLabel>
  {/each}
</div>
