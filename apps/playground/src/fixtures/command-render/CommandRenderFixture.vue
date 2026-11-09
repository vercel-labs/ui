<script setup lang="ts">
import { Command, CommandInput, CommandItem, CommandList } from "@ui-sdk/vue"
import { commandFixture as f } from "tests/fixtures/command.ts"
import { ref } from "vue"

const action = ref("")

function onAction(value: string) {
  action.value = `action:${value}`
}
</script>

<!-- Parts rendered as other elements, with render slots and class names of state. -->
<template>
  <div class="fixture">
    <button>Before</button>
    <Command @action="onAction">
      <template #render="{ props, state }">
        <div
          v-bind="props"
          :class="['command', state.page ? 'is-paged' : 'is-first']"
        >
          <CommandInput class="input" :aria-label="f.input" />
          <CommandList class="command-list">
            <CommandItem class="item" value="docs" href="#docs">
              <template #render="{ props }">
                <a v-bind="props">Docs</a>
              </template>
            </CommandItem>
            <CommandItem
              v-for="item in f.groups[0].items.slice(0, 2)"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
              <template #render="{ props, state: itemState }">
                <div
                  v-bind="props"
                  :class="[
                    'item',
                    itemState.highlighted ? 'is-highlighted' : '',
                  ]"
                >
                  {{ item.label }}{{ itemState.highlighted ? " ←" : "" }}
                </div>
              </template>
            </CommandItem>
          </CommandList>
        </div>
      </template>
    </Command>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
