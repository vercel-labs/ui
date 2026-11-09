<script setup lang="ts">
import { createCollapsibleController } from "@ui-sdk/core/collapsible"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/vue"
import { collapsibleFixture as fixture } from "tests/fixtures/collapsible.ts"
import { collapsibleOptions } from "tests/fixtures/page.ts"
import { ref } from "vue"

const controller = createCollapsibleController()
const { cancel, keepMounted, hiddenUntilFound, ...options } =
  collapsibleOptions()

const action = ref("")
const reason = ref("")
const source = ref("")
const complete = ref("")

function onOpenChange(
  open: boolean,
  details: { reason: string; source: string; cancel: () => void }
) {
  if (cancel === (open ? "open" : "close")) {
    return details.cancel()
  }
  action.value = open ? "open" : "closed"
  reason.value = details.reason
  source.value = details.source
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Collapsible
      class="collapsible"
      v-bind="options"
      :controller="controller"
      @open-change="onOpenChange"
      @open-change-complete="
        (open: boolean) => (complete = open ? 'open' : 'closed')
      "
    >
      <CollapsibleTrigger class="collapsible-trigger">{{
        fixture.trigger
      }}</CollapsibleTrigger>
      <CollapsiblePanel
        class="collapsible-panel"
        :keep-mounted="keepMounted"
        :hidden-until-found="hiddenUntilFound"
      >
        <p>{{ fixture.content }}</p>
        <label>{{ fixture.field }} <input /></label>
        <button @click="controller.close()">{{ fixture.close }}</button>
      </CollapsiblePanel>
    </Collapsible>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output aria-label="Last reason">{{ reason }}</output>
    <output aria-label="Last source">{{ source }}</output>
    <output aria-label="Last completed">{{ complete }}</output>
    <button @click="controller.toggle()">{{ fixture.controller }}</button>
  </div>
</template>
