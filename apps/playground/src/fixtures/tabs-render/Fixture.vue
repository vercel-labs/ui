<script setup lang="ts">
import { Tabs, TabsList, TabsPanel, TabsTab } from "@ui-sdk/vue"
import { tabsOptions } from "tests/fixtures/page.ts"
import { ref } from "vue"

const { activation } = tabsOptions()
const action = ref("")
const reason = ref("")
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Tabs
      class="tabs"
      default-value="overview"
      :activation="activation"
      @value-change="
        (value: string | null, details: { reason: string }) => {
          action = value ?? ''
          reason = details.reason
        }
      "
    >
      <TabsList class="tablist" aria-label="Project">
        <TabsTab class="tab" value="overview" href="#overview">
          <template #render="{ props }">
            <a v-bind="props">Overview</a>
          </template>
        </TabsTab>
        <TabsTab class="tab" value="activity" href="#activity">
          <template #render="{ props }">
            <a v-bind="props">Activity</a>
          </template>
        </TabsTab>
        <TabsTab class="tab" value="watched">
          <template #render="{ props, state }">
            <button v-bind="props">
              Watched<span v-if="state.selected" aria-hidden="true"> •</span>
            </button>
          </template>
        </TabsTab>
        <TabsTab v-slot="{ state }" class="tab" value="plain">
          <span :class="state.selected ? 'is-selected' : 'is-unselected'"
            >Plain</span
          >
        </TabsTab>
      </TabsList>
      <TabsPanel
        v-for="value in ['overview', 'activity', 'watched', 'plain']"
        :key="value"
        class="panel"
        :value="value"
      >
        The {{ value }} panel.
      </TabsPanel>
    </Tabs>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Reason">{{ reason }}</output>
  </div>
</template>
