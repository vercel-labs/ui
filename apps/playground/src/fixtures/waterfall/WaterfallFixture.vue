<script setup lang="ts">
import {
  createWaterfallController,
  Waterfall,
  WaterfallAxis,
  WaterfallBar,
  WaterfallCell,
  WaterfallColumnHeader,
  WaterfallHeaderRow,
  WaterfallIndicator,
  WaterfallMark,
  WaterfallRow,
  WaterfallRowHeader,
} from "@ui-sdk/vue"
import {
  describeWaterfall,
  flatWaterfall,
  waterfallFixture,
  waterfallOptions,
} from "tests/fixtures/waterfall.ts"
import { ref } from "vue"

const controller = createWaterfallController()
const spans = flatWaterfall(waterfallFixture.items)
const { cancel, range: startRange, ...options } = waterfallOptions()

const action = ref("")
const range = ref(startRange)

function onExpandedChange(expanded: string[], details: { cancel: () => void }) {
  if (cancel && expanded.includes(cancel) && !controller.isExpanded(cancel)) {
    return details.cancel()
  }
  action.value = describeWaterfall("expanded", expanded)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Waterfall
      :aria-label="waterfallFixture.label"
      :items="waterfallFixture.items"
      :controller="controller"
      :range="range"
      v-bind="options"
      @value-change="
        (value: string | null) =>
          (action = describeWaterfall('selected', value))
      "
      @expanded-change="onExpandedChange"
    >
      <WaterfallHeaderRow>
        <WaterfallColumnHeader>Name</WaterfallColumnHeader>
        <WaterfallColumnHeader>Status</WaterfallColumnHeader>
        <WaterfallColumnHeader aria-label="Timeline">
          <WaterfallAxis />
          <WaterfallMark :time="waterfallFixture.mark.time">{{
            waterfallFixture.mark.label
          }}</WaterfallMark>
        </WaterfallColumnHeader>
      </WaterfallHeaderRow>
      <WaterfallRow v-for="span in spans" :key="span.value" :value="span.value">
        <WaterfallRowHeader>
          <WaterfallIndicator v-if="span.children" />{{ span.label }}
        </WaterfallRowHeader>
        <WaterfallCell>{{ span.status }}</WaterfallCell>
        <WaterfallBar />
      </WaterfallRow>
    </Waterfall>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <button @click="controller.expandAll()">Expand all</button>
    <button @click="controller.collapseAll()">Collapse all</button>
    <button @click="controller.reveal('flags')">Reveal flags</button>
    <button @click="range = [500, 1000]">Zoom</button>
  </div>
</template>
