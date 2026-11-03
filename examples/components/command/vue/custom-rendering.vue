<script setup lang="ts">
import { CornerDownLeftIcon } from "@lucide/vue"
import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/vue/command"

const pages = ["Composition", "Installation", "Styling"]
</script>

<template>
  <Command>
    <template #render="{ props, state }">
      <div v-bind="props">
        <CommandInput aria-label="Search docs" placeholder="Search docs...">
          <template #render="{ props: input }">
            <input v-bind="input" />
          </template>
        </CommandInput>
        <CommandList>
          <CommandItem v-for="page in pages" :key="page" :value="page">
            <template #render="{ props: item, state: command }">
              <a v-bind="item" :href="`#${page.toLowerCase()}`">
                {{ page }}
                <CornerDownLeftIcon aria-hidden="true" v-if="command.highlighted" />
              </a>
            </template>
          </CommandItem>
        </CommandList>
      </div>
    </template>
  </Command>
</template>
