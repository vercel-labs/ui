<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"

  const options = [
    {
      label: "Share across devices",
      description: "Focus is shared across devices, and turns off when you leave the app.",
      defaultChecked: false,
    },
    {
      label: "Enable notifications",
      description: "Receive notifications when focus mode is enabled or disabled.",
      defaultChecked: true,
    },
  ]
</script>

<div data-slot="stack">
  {#each options as option (option.label)}
    <Field data-variant="card">
      <div data-slot="stack">
        <FieldLabel>
          {option.label}
        </FieldLabel>
        <FieldDescription>{option.description}</FieldDescription>
      </div>
      <Switch defaultChecked={option.defaultChecked}>
        <SwitchThumb />
      </Switch>
    </Field>
  {/each}
</div>
