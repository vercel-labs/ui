<script setup lang="ts">
import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  useAsyncOptions,
  type ListData,
} from "@ui-sdk/vue"
import {
  autocompleteFixture as f,
  autocompleteOptions,
  changedItems,
  searchFruits,
} from "tests/fixtures/autocomplete.ts"
import { onItemsChange } from "tests/fixtures/items.ts"
import { serializeForm } from "tests/fixtures/select.ts"
import {
  computed,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  type FunctionalComponent,
} from "vue"

const props = defineProps<{ data?: boolean }>()
// ?late is React only.
const {
  fieldset,
  grouped,
  async,
  late: _late,
  container,
  highlight,
  recent,
  nostatus,
  ...options
} = autocompleteOptions()
const action = ref("")
const submitted = ref("")
const remote = useAsyncOptions(searchFruits, { immediate: async })
const list = shallowRef<
  { value: string; label: string; keywords?: string[]; disabled?: boolean }[]
>(f.items)
// Items a spec swaps in. Only in the browser: the server has no document.
let stopItemChanges = () => {}
onMounted(
  () =>
    (stopItemChanges = onItemsChange(
      changedItems,
      (next) => (list.value = next)
    ))
)
onBeforeUnmount(() => stopItemChanges())
const items = computed(() =>
  async
    ? remote.state.value.items
    : grouped
      ? f.groups.map((group) => ({
          type: "group" as const,
          label: group.label,
          items: group.items,
        }))
      : list.value
)
const dataMode = props.data || async || recent

// The list's data, rendered like the composed list: items, and groups with their labels.
const DataItems: FunctionalComponent<{ items: ListData }> = ({ items }) =>
  items.map((entry, index) => {
    if (typeof entry === "string") {
      return dataItem({ value: entry, label: entry })
    }
    if ("value" in entry) {
      return dataItem(entry)
    }
    if (entry.type === "separator") {
      return h(AutocompleteSeparator, { key: `separator-${index}` })
    }
    return h(AutocompleteGroup, { key: entry.label }, () => [
      h(AutocompleteGroupLabel, { class: "label" }, () => entry.label),
      h(DataItems, { items: entry.items }),
    ])
  })
const dataItem = (item: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}) =>
  h(AutocompleteItem, { key: item.value, class: "item", ...item }, () =>
    highlight ? h(AutocompleteItemText, null, () => item.label) : item.label
  )

function onValueChange(value: string, details: { reason: string }) {
  action.value = `value:${value}:${details.reason}`
  if (async) {
    remote.setQuery(value)
  }
}

function onSubmit(event: Event) {
  submitted.value = serializeForm(event.target as HTMLFormElement)
}
</script>

<template>
  <div class="fixture">
    <button>Before</button>
    <form
      class="select-form"
      :aria-label="f.formLabel"
      @submit.prevent="onSubmit"
    >
      <component
        :is="fieldset ? 'fieldset' : 'div'"
        :disabled="fieldset || undefined"
        style="display: contents"
      >
        <Autocomplete
          v-bind="options"
          :name="f.name"
          :container="container"
          :items="dataMode ? items : undefined"
          :empty-items="recent ? f.recent : undefined"
          :filter="async ? false : undefined"
          :status="async ? remote.state.value.status : undefined"
          @value-change="onValueChange"
          @submit="(value: string) => (action = `submit:${value}`)"
        >
          <AutocompleteLabel class="label">{{ f.label }}</AutocompleteLabel>
          <AutocompleteInput class="input" />
          <AutocompleteTrigger :aria-label="f.trigger">▾</AutocompleteTrigger>
          <AutocompleteClear>{{ f.clear }}</AutocompleteClear>
          <AutocompleteContent class="popup list-popup">
            <AutocompleteStatus
              v-if="!nostatus"
              class="status"
              v-slot="{ state }"
              >{{ state.loading ? "Loading…" : "" }}</AutocompleteStatus
            >
            <AutocompleteEmpty class="empty">{{ f.empty }}</AutocompleteEmpty>
            <AutocompleteList v-if="dataMode" v-slot="{ state }">
              <DataItems :items="state.items as ListData" />
            </AutocompleteList>
            <AutocompleteList v-else>
              <template v-if="grouped">
                <AutocompleteGroup v-for="group in f.groups" :key="group.label">
                  <AutocompleteGroupLabel class="label">{{
                    group.label
                  }}</AutocompleteGroupLabel>
                  <AutocompleteItem
                    v-for="item in group.items"
                    :key="item.value"
                    class="item"
                    :value="item.value"
                    :label="item.label"
                  >
                    {{ item.label }}
                  </AutocompleteItem>
                </AutocompleteGroup>
              </template>
              <template v-else>
                <AutocompleteItem
                  v-for="item in list"
                  :key="item.value"
                  class="item"
                  :value="item.value"
                  :label="item.label"
                  :keywords="item.keywords"
                  :disabled="item.disabled"
                >
                  <AutocompleteItemText v-if="highlight">{{
                    item.label
                  }}</AutocompleteItemText>
                  <template v-else>{{ item.label }}</template>
                </AutocompleteItem>
              </template>
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </component>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
