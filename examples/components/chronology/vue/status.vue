<script setup lang="ts">
import { CheckIcon } from "@lucide/vue"
import {
  Chronology,
  ChronologyConnector,
  ChronologyDescription,
  ChronologyItem,
  ChronologyMarker,
  ChronologyTime,
  ChronologyTitle,
  createChronologyController,
  type ChronologyStatus,
} from "@ui-sdk/vue/chronology"

const steps: {
  value: string
  title: string
  dateTime: string
  time: string
  description: string
  status: ChronologyStatus
}[] = [
  {
    value: "placed",
    title: "Order placed",
    dateTime: "2026-11-01",
    time: "Nov 1",
    description: "We received your order.",
    status: "complete",
  },
  {
    value: "packed",
    title: "Packed",
    dateTime: "2026-11-02",
    time: "Nov 2",
    description: "Your items left the shelf.",
    status: "complete",
  },
  {
    value: "shipped",
    title: "Shipped",
    dateTime: "2026-11-03",
    time: "Nov 3",
    description: "On its way with the carrier.",
    status: "current",
  },
  {
    value: "delivered",
    title: "Delivered",
    dateTime: "2026-11-05",
    time: "Nov 5",
    description: "Expected by Thursday.",
    status: "upcoming",
  },
]

const controller = createChronologyController()
</script>

<template>
  <div data-slot="stack">
    <div data-slot="controls">
      <button type="button" @click="controller.focus('shipped')">
        Go to Current Step
      </button>
    </div>
    <Chronology aria-label="Order status" :controller="controller">
      <ChronologyItem
        v-for="step in steps"
        :key="step.value"
        :value="step.value"
        :status="step.status"
      >
        <ChronologyMarker>
          <CheckIcon v-if="step.status === 'complete'" aria-hidden="true" />
        </ChronologyMarker>
        <ChronologyConnector />
        <ChronologyTitle>{{ step.title }}</ChronologyTitle>
        <ChronologyTime :datetime="step.dateTime">{{
          step.time
        }}</ChronologyTime>
        <ChronologyDescription>{{ step.description }}</ChronologyDescription>
      </ChronologyItem>
    </Chronology>
  </div>
</template>
