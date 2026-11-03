<script setup lang="ts">
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
</script>

<template>
  <div dir="rtl">
    <label data-slot="label">
      <Switch>
        <SwitchThumb />
      </Switch>
      وضع الطيران
    </label>
  </div>
</template>
