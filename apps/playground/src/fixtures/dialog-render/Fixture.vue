<script setup lang="ts">
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/vue"
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Dialog>
      <DialogTrigger>
        <template #render="{ props, state }">
          <button v-bind="props" :class="state.open ? 'is-open' : 'is-closed'">
            Shipping
            <span aria-hidden="true">{{ state.open ? "▲" : "▼" }}</span>
          </button>
        </template>
      </DialogTrigger>
      <DialogBackdrop class="dialog-backdrop">
        <template #render="{ props }">
          <section v-bind="props" />
        </template>
      </DialogBackdrop>
      <DialogContent v-slot="{ state }" class="dialog">
        <span :class="state.open ? 'is-open' : 'is-closed'" hidden />
        <DialogTitle>
          <template #render="{ props }">
            <h3 v-bind="props">Shipping</h3>
          </template>
        </DialogTitle>
        <DialogDescription>
          <template #render="{ props }">
            <div v-bind="props">Arrives in two days.</div>
          </template>
        </DialogDescription>
        <DialogClose href="#done">
          <template #render="{ props }">
            <a v-bind="props">Done</a>
          </template>
        </DialogClose>
      </DialogContent>
    </Dialog>
    <button>After</button>
  </div>
</template>
