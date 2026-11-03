<script setup lang="ts">
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsOverflow,
  ComboboxClear,
  ComboboxContent,
  ComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxSelectAll,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
  useAsyncOptions,
} from "@ui-sdk/vue"
import {
  cancelsValue,
  changedItems,
  comboboxFixture as f,
  comboboxOptions,
  createDelay,
  searchCountries,
  searchCountryPages,
} from "tests/fixtures/combobox.ts"
import { onItemsChange } from "tests/fixtures/items.ts"
import { longItems, serializeForm } from "tests/fixtures/select.ts"
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue"

const props = defineProps<{ data?: boolean }>()
const {
  fieldset,
  grouped,
  create,
  slow,
  async,
  long,
  // ?late is React only.
  late: _late,
  container,
  highlight,
  recent,
  selectAll,
  overflow,
  pages,
  nostatus,
  summary,
  labelsFromItems,
  cancel,
  ...options
} = comboboxOptions()
const action = ref("")
const submitted = ref("")
const created = ref<{ value: string; label: string }[]>([])
const remote = useAsyncOptions(pages ? searchCountryPages : searchCountries, { immediate: async || pages })
const remoteMode = async || pages
const list = shallowRef<{ value: string; label: string; keywords?: string[]; disabled?: boolean }[]>(f.items)
// Items a spec swaps in. Only in the browser: the server has no document.
let stopItemChanges = () => {}
onMounted(() => (stopItemChanges = onItemsChange(changedItems, (next) => (list.value = next))))
onBeforeUnmount(() => stopItemChanges())
const all = computed(() => [...list.value, ...created.value])
const labels = computed(() => new Map([...f.items, ...all.value].map((item) => [item.value, item.label])))
const items = computed(() =>
  remoteMode
    ? remote.state.value.items
    : long
      ? longItems()
      : grouped
        ? f.groups.map((group) => ({ type: "group" as const, label: group.label, items: group.items }))
        : all.value,
)

// What the list shows from its data: items, and groups of them.
type Entry = { value: string; label: string; keywords?: string[]; disabled?: boolean }
type Shown = Entry | { type: "group"; label: string; items: Entry[] }
const dataMode = props.data || remoteMode || long || recent

function onValueChange(value: unknown, details: { cancel: () => void }) {
  if (cancelsValue(value, cancel)) return details.cancel()
  action.value = `value:${Array.isArray(value) ? value.join(",") : String(value)}`
}

async function onCreate(query: string) {
  action.value = `create:${query}`
  await createDelay(slow)
  created.value = [...created.value, { value: query.toLowerCase(), label: query }]
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
        <Combobox
          v-bind="options"
          :name="f.name"
          :container="container"
          :items="dataMode ? items : undefined"
          :empty-items="recent ? f.recent : undefined"
          :filter="remoteMode ? false : undefined"
          :status="remoteMode ? remote.state.value.status : undefined"
          :item-to-label="labelsFromItems ? undefined : (value: string) => labels.get(value) ?? value"
          @value-change="onValueChange"
          @query-change="(query: string) => remoteMode && remote.setQuery(query)"
          @load-more="() => pages && remote.loadMore()"
        >
          <ComboboxLabel class="label">{{ f.label }}</ComboboxLabel>
          <ComboboxChips v-if="options.multiple" :class="overflow ? 'chips chips-line' : 'chips'">
            <ComboboxValue v-slot="{ value }">
              <ComboboxChip v-for="item in value as string[]" :key="item" class="chip" :value="item">
                {{ labels.get(item) ?? item }}
                <ComboboxChipRemove :aria-label="`Remove ${labels.get(item) ?? item}`">×</ComboboxChipRemove>
              </ComboboxChip>
            </ComboboxValue>
            <ComboboxChipsOverflow v-if="overflow" class="chips-overflow" />
            <ComboboxInput class="input" />
          </ComboboxChips>
          <ComboboxInput v-else class="input" />
          <output v-if="summary" :aria-label="f.summary"><ComboboxValue :max-labels="summary" /></output>
          <ComboboxTrigger :aria-label="f.trigger">▾</ComboboxTrigger>
          <ComboboxClear>{{ f.clear }}</ComboboxClear>
          <ComboboxContent :class="pages ? 'popup list-popup list-short' : 'popup list-popup'">
            <ComboboxStatus v-if="!nostatus" v-slot="{ state }" class="status">{{
              state.loading ? (pages ? "Loading more…" : "Loading…") : ""
            }}</ComboboxStatus>
            <ComboboxEmpty class="empty">{{ f.empty }}</ComboboxEmpty>
            <ComboboxList v-if="dataMode" v-slot="{ state }">
              <ComboboxSelectAll v-if="selectAll" class="item">{{ f.selectAll }}</ComboboxSelectAll>
              <template
                v-for="entry in state.items as Shown[]"
                :key="'items' in entry ? entry.label : entry.value"
              >
                <ComboboxGroup v-if="'items' in entry">
                  <ComboboxGroupLabel class="label">{{ entry.label }}</ComboboxGroupLabel>
                  <ComboboxItem
                    v-for="item in entry.items"
                    :key="item.value"
                    class="item"
                    :value="item.value"
                    :label="item.label"
                    :keywords="item.keywords"
                    :disabled="item.disabled"
                  >
                    <ComboboxItemText v-if="highlight">{{ item.label }}</ComboboxItemText>
                    <template v-else>{{ item.label }}</template>
                    <ComboboxItemIndicator class="indicator">✓</ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
                <ComboboxItem
                  v-else
                  class="item"
                  :value="entry.value"
                  :label="entry.label"
                  :keywords="entry.keywords"
                  :disabled="entry.disabled"
                >
                  <ComboboxItemText v-if="highlight">{{ entry.label }}</ComboboxItemText>
                  <template v-else>{{ entry.label }}</template>
                  <ComboboxItemIndicator class="indicator">✓</ComboboxItemIndicator>
                </ComboboxItem>
              </template>
              <ComboboxCreate v-if="create" class="item" @create="onCreate" />
            </ComboboxList>
            <ComboboxList v-else>
              <template v-if="grouped">
                <ComboboxGroup v-for="group in f.groups" :key="group.label">
                  <ComboboxGroupLabel class="label">{{ group.label }}</ComboboxGroupLabel>
                  <ComboboxSelectAll v-if="selectAll" class="item"
                    >{{ f.selectAll }} {{ group.label }}</ComboboxSelectAll
                  >
                  <ComboboxItem
                    v-for="item in group.items"
                    :key="item.value"
                    class="item"
                    :value="item.value"
                    :label="item.label"
                  >
                    <ComboboxItemText v-if="highlight">{{ item.label }}</ComboboxItemText>
                    <template v-else>{{ item.label }}</template>
                    <ComboboxItemIndicator class="indicator">✓</ComboboxItemIndicator>
                  </ComboboxItem>
                </ComboboxGroup>
              </template>
              <template v-else>
                <ComboboxSelectAll v-if="selectAll" class="item">{{ f.selectAll }}</ComboboxSelectAll>
                <ComboboxItem
                  v-for="item in all"
                  :key="item.value"
                  class="item"
                  :value="item.value"
                  :label="item.label"
                  :keywords="(item as { keywords?: string[] }).keywords"
                  :disabled="(item as { disabled?: boolean }).disabled"
                >
                  <ComboboxItemText v-if="highlight">{{ item.label }}</ComboboxItemText>
                  <template v-else>{{ item.label }}</template>
                  <ComboboxItemIndicator class="indicator">✓</ComboboxItemIndicator>
                </ComboboxItem>
              </template>
              <ComboboxCreate v-if="create" class="item" @create="onCreate" />
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </component>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
    <button>After</button>
    <output role="status" aria-label="Last action">{{ action }}</output>
    <output role="status" aria-label="Submitted">{{ submitted }}</output>
  </div>
</template>
