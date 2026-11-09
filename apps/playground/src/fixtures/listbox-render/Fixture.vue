<script setup lang="ts">
import { Listbox, ListboxItem } from "@ui-sdk/vue"
import { listboxAction, listboxFixture as f } from "tests/fixtures/listbox.ts"
import { ref } from "vue"

const action = ref("")
</script>

<!-- Parts rendered as other elements, with render slots and class names of state. -->
<template>
  <div class="fixture">
    <button>Before</button>
    <Listbox
      :aria-label="f.label"
      class="listbox"
      activation="manual"
      @value-change="(value: unknown) => (action = listboxAction(value))"
    >
      <template #render="{ props }">
        <ul v-bind="props">
          <ListboxItem class="item" value="docs" href="#docs">
            <template #render="{ props }">
              <a v-bind="props">Docs</a>
            </template>
          </ListboxItem>
          <ListboxItem value="star">
            <template #render="{ props, state }">
              <li
                v-bind="props"
                :class="[
                  'item',
                  state.selected ? 'is-selected' : 'is-unselected',
                ]"
              >
                {{ state.selected ? "★" : "☆" }} Star
              </li>
            </template>
          </ListboxItem>
          <ListboxItem
            v-for="item in f.items.slice(0, 3)"
            :key="item.value"
            class="item"
            :value="item.value"
          >
            <template #render="{ props }">
              <li v-bind="props">
                {{ item.label }}
              </li>
            </template>
          </ListboxItem>
        </ul>
      </template>
    </Listbox>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
  </div>
</template>
