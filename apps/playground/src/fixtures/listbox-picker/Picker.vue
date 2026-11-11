<script setup lang="ts">
import { bindScrollPicker } from "@ui-sdk/core"
import { Listbox, ListboxItem } from "@ui-sdk/vue/listbox"
import type { PickerFixture } from "tests/fixtures/listbox-picker.ts"
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue"

const props = defineProps<{ picker: PickerFixture }>()
const value = ref<string | null>(props.picker.defaultValue)
const changes = ref<string[]>([])
const holder = useTemplateRef<HTMLElement>("holder")
let unbind: (() => void) | undefined

function choose(next: string | null) {
  value.value = next
  changes.value = [...changes.value, String(next)]
}

// Listbox renders its hidden form inputs beside its root, so its own ref isn't the listbox element.
onMounted(() => {
  unbind = bindScrollPicker(
    holder.value!.querySelector<HTMLElement>('[role="listbox"]')!,
    { onSelect: (index) => choose(props.picker.items[index].value) }
  )
})
onBeforeUnmount(() => unbind?.())
</script>

<template>
  <div ref="holder">
    <Listbox
      class="picker"
      :aria-label="picker.label"
      :orientation="picker.orientation"
      :scroll-into-view="false"
      :value="value"
      @update:value="choose"
    >
      <ListboxItem
        v-for="item in picker.items"
        :key="item.value"
        class="picker-item"
        :value="item.value"
        :disabled="item.disabled"
      >
        {{ item.value }}
      </ListboxItem>
    </Listbox>
    <output role="status" :aria-label="`${picker.label} changes`">{{
      changes.join(",")
    }}</output>
  </div>
</template>
