<script setup lang="ts">
import { pickerFixtures } from "tests/fixtures/listbox-picker.ts"
import Picker from "./Picker.vue"
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Picker
      v-for="picker in pickerFixtures"
      :key="picker.label"
      :picker="picker"
    />
    <button>After</button>
  </div>
</template>
