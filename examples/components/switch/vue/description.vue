<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
</script>

<template>
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
</template>
