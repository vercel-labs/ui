<script setup lang="ts">
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/vue"
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Popover>
      <PopoverTrigger>
        <template #render="{ props, state }">
          <button v-bind="props" :class="state.open ? 'is-open' : 'is-closed'">
            Details <span aria-hidden="true">{{ state.open ? "▲" : "▼" }}</span>
          </button>
        </template>
      </PopoverTrigger>
      <PopoverContent class="popup">
        <PopoverTitle>
          <template #render="{ props }">
            <h3 v-bind="props">Shipping</h3>
          </template>
        </PopoverTitle>
        <PopoverClose href="#done">
          <template #render="{ props }">
            <a v-bind="props">Done</a>
          </template>
        </PopoverClose>
      </PopoverContent>
    </Popover>
    <button>After</button>
  </div>
</template>
