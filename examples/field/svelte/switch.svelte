<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"
</script>

<Field data-variant="card">
  <div data-slot="stack">
    <FieldLabel>Multi-factor authentication</FieldLabel>
    <FieldDescription>
      Enable multi-factor authentication. If you don't have a two-factor device, use a one-time code sent to
      your email.
    </FieldDescription>
  </div>
  <Switch name="mfa">
    <SwitchThumb />
  </Switch>
</Field>
