<script lang="ts">
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
    ComboboxSeparator,
    ComboboxStatus,
    ComboboxTrigger,
    ComboboxValue,
    useAsyncOptions,
    type ListData,
  } from "@ui-sdk/svelte"
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

  let { data = false }: { data?: boolean } = $props()

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
  let action = $state("")
  let submitted = $state("")
  let created = $state.raw<{ value: string; label: string }[]>([])
  const remoteMode = async || pages
  const remote = useAsyncOptions(pages ? searchCountryPages : searchCountries, {
    immediate: remoteMode,
  })
  let list = $state.raw<
    { value: string; label: string; keywords?: string[]; disabled?: boolean }[]
  >(f.items)
  // Items a spec swaps in. Only in the browser: the server has no document.
  $effect(() => onItemsChange(changedItems, (next) => (list = next)))
  const all = $derived([...list, ...created])
  const labels = $derived(
    new Map([...f.items, ...all].map((item) => [item.value, item.label]))
  )
  const items = $derived(
    remoteMode
      ? remote.state.items
      : long
        ? longItems()
        : grouped
          ? f.groups.map((group) => ({
              type: "group" as const,
              label: group.label,
              items: group.items,
            }))
          : all
  )
  // A data entry's key: its value, a group's label, or a separator's place.
  const keyOf = (entry: ListData[number], index: number) =>
    typeof entry === "string"
      ? entry
      : "value" in entry
        ? entry.value
        : entry.type === "group"
          ? `group-${entry.label ?? index}`
          : `separator-${index}`
  const dataMode = $derived(data || remoteMode || long || recent)
  const labelOf = (value: string) => labels.get(value) ?? value

  function onValueChange(value: unknown, details: { cancel: () => void }) {
    if (cancelsValue(value, cancel)) {
      return details.cancel()
    }
    action = `value:${Array.isArray(value) ? value.join(",") : String(value)}`
  }

  async function onCreate(query: string) {
    action = `create:${query}`
    await createDelay(slow)
    created = [...created, { value: query.toLowerCase(), label: query }]
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = serializeForm(event.target as HTMLFormElement)
  }
</script>

{#snippet composedItem(item: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
})}
  <ComboboxItem
    class="item"
    value={item.value}
    label={item.label}
    keywords={item.keywords}
    disabled={item.disabled}
  >
    {#if highlight}<ComboboxItemText>{item.label}</ComboboxItemText
      >{:else}{item.label}{/if}
    <ComboboxItemIndicator class="indicator">✓</ComboboxItemIndicator>
  </ComboboxItem>
{/snippet}

<!-- The list's data, rendered like the composed list: items with their check, and groups with their labels. -->
{#snippet dataItems(entries: ListData)}
  {#each entries as entry, index (keyOf(entry, index))}
    {#if typeof entry === "string"}
      {@render composedItem({ value: entry, label: entry })}
    {:else if "value" in entry}
      {@render composedItem(entry)}
    {:else if entry.type === "separator"}
      <ComboboxSeparator />
    {:else}
      <ComboboxGroup>
        <ComboboxGroupLabel class="label">{entry.label}</ComboboxGroupLabel>
        {@render dataItems(entry.items)}
      </ComboboxGroup>
    {/if}
  {/each}
{/snippet}

<div class="fixture">
  <button>Before</button>
  <form class="select-form" aria-label={f.formLabel} onsubmit={onSubmit}>
    <svelte:element
      this={fieldset ? "fieldset" : "div"}
      disabled={fieldset || undefined}
      style="display: contents"
    >
      <Combobox
        {...options}
        name={f.name}
        {container}
        items={dataMode ? items : undefined}
        emptyItems={recent ? f.recent : undefined}
        filter={remoteMode ? false : undefined}
        status={remoteMode ? remote.state.status : undefined}
        itemToLabel={labelsFromItems ? undefined : labelOf}
        {onValueChange}
        onQueryChange={(query) => remoteMode && remote.setQuery(query)}
        onLoadMore={() => pages && remote.loadMore()}
      >
        <ComboboxLabel class="label">{f.label}</ComboboxLabel>
        {#if options.multiple}
          <ComboboxChips class={overflow ? "chips chips-line" : "chips"}>
            <ComboboxValue>
              {#snippet children(state)}
                {#each state.value as string[] as item (item)}
                  <ComboboxChip class="chip" value={item}>
                    {labelOf(item)}
                    <ComboboxChipRemove aria-label={`Remove ${labelOf(item)}`}
                      >×</ComboboxChipRemove
                    >
                  </ComboboxChip>
                {/each}
              {/snippet}
            </ComboboxValue>
            {#if overflow}<ComboboxChipsOverflow class="chips-overflow" />{/if}
            <ComboboxInput class="input" />
          </ComboboxChips>
        {:else}
          <ComboboxInput class="input" />
        {/if}
        {#if summary}<output aria-label={f.summary}
            ><ComboboxValue maxLabels={summary} /></output
          >{/if}
        <ComboboxTrigger aria-label={f.trigger}>▾</ComboboxTrigger>
        <ComboboxClear>{f.clear}</ComboboxClear>
        <ComboboxContent
          class={pages ? "popup list-popup list-short" : "popup list-popup"}
        >
          {#if !nostatus}
            <ComboboxStatus class="status">
              {#snippet children(state)}{state.loading
                  ? pages
                    ? "Loading more…"
                    : "Loading…"
                  : ""}{/snippet}
            </ComboboxStatus>
          {/if}
          <ComboboxEmpty class="empty">{f.empty}</ComboboxEmpty>
          {#if dataMode}
            <ComboboxList>
              {#snippet children(state)}
                {#if selectAll}<ComboboxSelectAll class="item"
                    >{f.selectAll}</ComboboxSelectAll
                  >{/if}
                {@render dataItems(state.items as ListData)}
                {#if create}<ComboboxCreate class="item" {onCreate} />{/if}
              {/snippet}
            </ComboboxList>
          {:else}
            <ComboboxList>
              {#if grouped}
                {#each f.groups as group (group.label)}
                  <ComboboxGroup>
                    <ComboboxGroupLabel class="label"
                      >{group.label}</ComboboxGroupLabel
                    >
                    {#if selectAll}<ComboboxSelectAll class="item"
                        >{f.selectAll} {group.label}</ComboboxSelectAll
                      >{/if}
                    {#each group.items as item (item.value)}
                      {@render composedItem(item)}
                    {/each}
                  </ComboboxGroup>
                {/each}
              {:else}
                {#if selectAll}<ComboboxSelectAll class="item"
                    >{f.selectAll}</ComboboxSelectAll
                  >{/if}
                {#each all as item (item.value)}
                  {@render composedItem(item)}
                {/each}
              {/if}
              {#if create}<ComboboxCreate class="item" {onCreate} />{/if}
            </ComboboxList>
          {/if}
        </ComboboxContent>
      </Combobox>
    </svelte:element>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
