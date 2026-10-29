<script setup lang="ts">
import {
  createListboxController,
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxSeparator,
} from "@ui-sdk/vue"
import { onItemsChange } from "tests/fixtures/items.ts"
import {
  changedToppings,
  listboxAction,
  listboxData,
  listboxFixture as f,
  listboxOptions,
  longToppings,
} from "tests/fixtures/listbox.ts"
import { serializeForm } from "tests/fixtures/select.ts"
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue"

const props = defineProps<{ data?: boolean }>()
const controller = createListboxController<string, boolean>()
const { fieldset, grouped, cancel, long, controlled, defaultValue, ...options } = listboxOptions()
const action = ref("")
const reason = ref("")
const submitted = ref("")
const value = ref<unknown>(defaultValue ?? (options.multiple ? [] : null))
const list = shallowRef(f.items)
// Items a spec swaps in. Only in the browser: the server has no document.
let stopItemChanges = () => {}
onMounted(() => (stopItemChanges = onItemsChange(changedToppings, (next) => (list.value = next))))
onBeforeUnmount(() => stopItemChanges())
const items = computed(() => (long ? longToppings() : grouped ? listboxData(true) : list.value))
// What both the data listbox and the composed one take.
const shared = computed(() => ({
  ...options,
  ...(controlled ? { value: value.value } : { defaultValue }),
  class: "listbox",
  "aria-label": f.label,
  name: f.name,
  controller,
}))

// What the composed list holds, in order: the items, or groups with a separator between.
type Listed =
  | { type: "item"; key: string; value: string; label: string; disabled?: boolean }
  | { type: "group"; key: string; label: string; items: { value: string; label: string }[] }
  | { type: "separator"; key: string }
const listed = computed((): Listed[] =>
  grouped
    ? f.groups.flatMap((group, index): Listed[] => [
        ...(index ? [{ type: "separator" as const, key: `separator-${index}` }] : []),
        { type: "group", key: group.label, label: group.label, items: group.items },
      ])
    : (long ? longToppings() : list.value).map((item) => ({ type: "item", key: item.value, ...item })),
)

function onValueChange(next: unknown, details: { reason: string; cancel: () => void }) {
  reason.value = details.reason
  if (cancel) return details.cancel()
  value.value = next
  action.value = listboxAction(next)
}

function onSubmit(event: Event) {
  submitted.value = serializeForm(event.target as HTMLFormElement)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form class="select-form" :aria-label="f.formLabel" @submit.prevent="onSubmit">
      <component
        :is="fieldset ? 'fieldset' : 'div'"
        :disabled="fieldset || undefined"
        style="display: contents"
      >
        <!-- A data listbox knows every option from its items, and renders the same parts. -->
        <Listbox v-bind="shared" :items="props.data ? items : undefined" @value-change="onValueChange">
          <template v-for="item in listed" :key="item.key">
            <ListboxSeparator v-if="item.type === 'separator'" class="separator" />
            <ListboxGroup v-else-if="item.type === 'group'" class="group">
              <ListboxGroupLabel class="label">{{ item.label }}</ListboxGroupLabel>
              <ListboxItem v-for="child in item.items" :key="child.value" class="item" :value="child.value">
                <ListboxItemIcon class="icon" />
                {{ child.label }}
                <ListboxItemIndicator class="indicator">✓</ListboxItemIndicator>
              </ListboxItem>
            </ListboxGroup>
            <ListboxItem v-else class="item" :value="item.value" :disabled="item.disabled">
              <ListboxItemIcon class="icon" />
              {{ item.label }}
              <ListboxItemIndicator class="indicator">✓</ListboxItemIndicator>
            </ListboxItem>
          </template>
        </Listbox>
      </component>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Reason">{{ reason }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
    <button @click="controller.clear()">{{ f.clear }}</button>
    <button @click="controller.selectAll()">{{ f.selectAll }}</button>
  </div>
</template>
