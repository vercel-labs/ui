<script setup lang="ts">
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
</script>

<template>
  <label data-slot="label">
    <Switch disabled>
      <SwitchThumb />
    </Switch>
    Disabled
  </label>
</template>
