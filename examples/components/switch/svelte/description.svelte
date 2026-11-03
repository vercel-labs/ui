<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from "@ui-sdk/svelte/field"
  import { Switch, SwitchThumb } from "@ui-sdk/svelte/switch"
</script>

<Field>
  <div data-slot="stack">
    <FieldLabel>Share across devices</FieldLabel>
    <FieldDescription>
      Focus is shared across devices, and turns off when you leave the app.
    </FieldDescription>
  </div>
  <Switch>
    <SwitchThumb />
  </Switch>
</Field>
