<script setup lang="ts">
import { Field, FieldLabel, FieldLegend, FieldSet } from "@ui-sdk/vue/field"
import { Input } from "@ui-sdk/vue/input"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
import { ref } from "vue"

const same = ref(true)
</script>

<template>
  <div data-slot="stack">
    <label data-slot="label">
      <Switch v-model:checked="same">
        <SwitchThumb />
      </Switch>
      Billing address is the same as shipping
    </label>
    <FieldSet :disabled="same">
      <FieldLegend>Billing address</FieldLegend>
      <Field name="billing-street">
        <FieldLabel> Street address </FieldLabel>
        <Input autocomplete="billing street-address" />
      </Field>
      <Field name="billing-city">
        <FieldLabel> City </FieldLabel>
        <Input autocomplete="billing address-level2" />
      </Field>
    </FieldSet>
  </div>
</template>
