<script setup lang="ts">
import { ChevronRightIcon } from "@lucide/vue"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue/collapsible"
</script>

<template>
  <Collapsible>
    <template #render="{ props }">
      <div v-bind="props">
        <CollapsibleTrigger data-variant="secondary">
          <template #render="{ props: triggerProps, state: triggerState }">
            <h3>
              <button v-bind="triggerProps">
                <ChevronRightIcon />
                <span>Track parcel</span>
              </button>
              <span data-slot="hint">
                {{ triggerState.open ? "3 updates" : "Arrives Thursday" }}
              </span>
            </h3>
          </template>
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <template #render="{ props }">
            <ol v-bind="props">
              <li data-slot="row">Out for delivery <span>07:40</span></li>
              <li data-slot="row">Arrived at the local depot <span>05:12</span></li>
              <li data-slot="row">Left the sorting center <span>Wed 21:03</span></li>
            </ol>
          </template>
        </CollapsiblePanel>
      </div>
    </template>
  </Collapsible>
</template>
