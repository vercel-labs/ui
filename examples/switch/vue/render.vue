<script setup lang="ts">
import { Moon, Sun } from "@lucide/vue"
import { Switch, SwitchThumb } from "@ui-sdk/vue/switch"
</script>

<template>
  <label data-slot="label">
    <Switch>
      <template #render="{ props, state }">
        <button v-bind="props">
          <SwitchThumb>
            <template #render="{ props, state: thumbState }">
              <span v-bind="props">
                <Moon v-if="thumbState.checked" />
                <Sun v-else />
              </span>
            </template>
          </SwitchThumb>
        </button>
      </template>
    </Switch>
    Dark mode
  </label>
</template>
