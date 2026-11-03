<script setup lang="ts">
import { Field, FieldDescription, FieldLabel } from "@ui-sdk/vue/field"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
</script>

<template>
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
</template>
