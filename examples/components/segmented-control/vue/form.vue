<script setup lang="ts">
import { Field, FieldLabel } from "@ui-sdk/vue/field"
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/vue/segmented-control"
import { useLog } from "../../../shared/vue/log"

const log = useLog()

function submit(event: Event) {
  log(`Submitted billing=${new FormData(event.currentTarget as HTMLFormElement).get("billing")}`)
}
</script>

<template>
  <form data-slot="stack" @submit.prevent="submit">
    <Field>
      <FieldLabel>Billing period</FieldLabel>
      <SegmentedControl name="billing" required default-value="monthly">
        <SegmentedControlIndicator />
        <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
        <SegmentedControlItem value="yearly">Yearly</SegmentedControlItem>
      </SegmentedControl>
    </Field>
    <div data-slot="row">
      <button type="submit" data-variant="solid">Continue</button>
      <button type="reset">Reset</button>
    </div>
  </form>
</template>
