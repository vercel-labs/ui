<script lang="ts">
  import type { InputValueChangeReason } from "@ui-sdk/core/input"
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Input } from "@ui-sdk/svelte/input"

  let name = $state("Ada")
  let reason = $state<InputValueChangeReason>()
</script>

<div data-slot="stack">
  <Field>
    <FieldLabel>
      Display name
    </FieldLabel>
    <Input
      bind:value={name}
      onValueChange={(_: string, details: { reason: InputValueChangeReason }) => (reason = details.reason)}
    />
    <FieldDescription>
      {reason ? `Changed by ${reason}.` : "Type to change it."}
    </FieldDescription>
  </Field>
  <Field>
    <FieldLabel>
      Profile URL
    </FieldLabel>
    <Input readOnly value={`example.com/${name.toLowerCase()}`} />
  </Field>
</div>
