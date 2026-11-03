<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"
</script>

<Field>
  <div data-slot="stack">
    <FieldLabel>Encrypt backups</FieldLabel>
    <FieldDescription>Managed by your organization.</FieldDescription>
  </div>
  <Switch defaultChecked readOnly>
    <SwitchThumb />
  </Switch>
</Field>
