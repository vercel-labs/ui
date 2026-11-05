<script setup lang="ts">
import {
  Checkbox,
  Label,
  NumberInput,
  NumberInputControl,
  Radio,
  RadioGroup,
  Slider,
  SliderControl,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/vue"
import { labelFixture } from "tests/fixtures/label.ts"
import { ref } from "vue"

const { email, plan, volume, terms, region, delivery, quantity } = labelFixture
const shown = ref(false)
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <Label :for="email.id">{{ email.label }}</Label>
    <input :id="email.id" />
    <Label :for="plan.id">{{ plan.label }}</Label>
    <RadioGroup :id="plan.id" class="radio-group" :default-value="plan.defaultValue">
      <Radio v-for="item in plan.items" :key="item.value" class="radio" :value="item.value">
        {{ item.label }}
      </Radio>
    </RadioGroup>
    <Label :for="volume.id">{{ volume.label }}</Label>
    <Slider :id="volume.id" class="slider" :default-value="volume.defaultValue">
      <SliderControl>
        <SliderTrack class="slider-track"><SliderThumb class="slider-thumb" /></SliderTrack>
      </SliderControl>
    </Slider>
    <Label><Checkbox class="checkbox" />{{ terms.label }}</Label>
    <Label :for="region.id">{{ region.label }}</Label>
    <RadioGroup :id="region.id" class="radio-group" disabled>
      <Radio v-for="item in region.items" :key="item.value" class="radio" :value="item.value">
        {{ item.label }}
      </Radio>
    </RadioGroup>
    <Label :for="delivery.id">{{ delivery.label }}</Label>
    <RadioGroup :id="delivery.id" class="radio-group" :aria-label="delivery.name">
      <Radio v-for="item in delivery.items" :key="item.value" class="radio" :value="item.value">
        {{ item.label }}
      </Radio>
    </RadioGroup>
    <Label :for="quantity.id">{{ quantity.label }}</Label>
    <NumberInput v-if="shown" :id="quantity.id" :default-value="quantity.defaultValue">
      <NumberInputControl />
    </NumberInput>
    <button v-else @click="shown = true">{{ quantity.show }}</button>
    <button>After</button>
  </div>
</template>
