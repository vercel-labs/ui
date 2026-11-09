<script setup lang="ts">
import {
  createNumberInputController,
  NumberInput,
  NumberInputControl,
  NumberInputGroup,
  NumberInputScrubArea,
} from "@ui-sdk/vue"
import { numberInputScrubFixture as f } from "tests/fixtures/number-input-scrub.ts"
import { ref } from "vue"

const controller = createNumberInputController()
const action = ref("")
const commits = ref<string[]>([])
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <div role="toolbar" :aria-label="f.toolbarLabel" class="row">
      <NumberInputScrubArea :controller="controller" class="number-input-scrub">
        {{ f.toolbarScrub }}
      </NumberInputScrubArea>
    </div>
    <table>
      <thead>
        <tr>
          <NumberInputScrubArea
            :controller="controller"
            class="number-input-scrub"
          >
            <template #render="{ props }">
              <th v-bind="props">
                {{ f.headerScrub }}
              </th>
            </template>
          </NumberInputScrubArea>
        </tr>
      </thead>
    </table>
    <NumberInput
      :id="f.id"
      :controller="controller"
      :default-value="f.defaultValue"
      :min="f.min"
      :max="f.max"
      locale="en-US"
      @value-change="(value) => (action = String(value))"
      @value-commit="(value) => (commits = [...commits, String(value)])"
    >
      <NumberInputGroup class="number-input-group">
        <NumberInputScrubArea class="number-input-scrub">{{
          f.letterScrub
        }}</NumberInputScrubArea>
        <NumberInputControl
          :aria-label="f.label"
          class="number-input-control"
        />
      </NumberInputGroup>
      <div>
        <div>
          <div>
            <NumberInputScrubArea class="number-input-scrub">{{
              f.nestedScrub
            }}</NumberInputScrubArea>
          </div>
        </div>
      </div>
    </NumberInput>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Committed">{{
      commits.join(" ")
    }}</output>
  </div>
</template>
