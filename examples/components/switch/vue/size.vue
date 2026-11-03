<script setup lang="ts">
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
</script>

<template>
  <div data-slot="row">
    <label data-slot="label">
      <Switch data-size="sm">
        <SwitchThumb />
      </Switch>
      Small
    </label>
    <label data-slot="label">
      <Switch>
        <SwitchThumb />
      </Switch>
      Default
    </label>
  </div>
</template>
