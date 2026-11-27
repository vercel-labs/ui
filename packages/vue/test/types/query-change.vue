<script setup lang="ts">
import { Combobox } from "../../src/combobox"
import { Command } from "../../src/command"
import { Select } from "../../src/select"

const searched = (_query: string, details: { composing: boolean }) =>
  details.composing
</script>

<template>
  <Command @query-change="searched" />
  <Combobox @query-change="searched" />
  <Select @query-change="searched" />
</template>
