<script setup lang="ts">
import { BoldIcon, ItalicIcon } from "@lucide/vue"
import { Toggle, ToggleIcon } from "@ui-sdk/vue/toggle"
</script>

<template>
  <div data-slot="row">
    <Toggle data-variant="outline">
      <ToggleIcon>
        <ItalicIcon />
      </ToggleIcon>
      Italic
    </Toggle>
    <Toggle data-variant="outline">
      <ToggleIcon>
        <BoldIcon />
      </ToggleIcon>
      Bold
    </Toggle>
  </div>
</template>
