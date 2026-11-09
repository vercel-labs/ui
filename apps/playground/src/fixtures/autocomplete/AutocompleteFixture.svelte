<script lang="ts">
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
  } from "@ui-sdk/svelte"
  import {
    autocompleteFixture as f,
    autocompleteOptions,
    changedItems,
    searchFruits,
  } from "tests/fixtures/autocomplete.ts"
  import { onItemsChange } from "tests/fixtures/items.ts"
  import { serializeForm } from "tests/fixtures/select.ts"

  let { data = false }: { data?: boolean } = $props()

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
  let action = $state("")
  let submitted = $state("")
  const remote = useAsyncOptions(searchFruits, { immediate: async })
  let list = $state.raw<
    { value: string; label: string; keywords?: string[]; disabled?: boolean }[]
  >(f.items)
  // Items a spec swaps in. Only in the browser: the server has no document.
  $effect(() => onItemsChange(changedItems, (next) => (list = next)))
  const items = $derived(
    async
      ? remote.state.items
      : grouped
        ? f.groups.map((group) => ({
            type: "group" as const,
            label: group.label,
            items: group.items,
          }))
        : list
  )
  const dataMode = $derived(data || async || recent)
  // A data entry's key: its value, a group's label, or a separator's place.
  const keyOf = (entry: ListData[number], index: number) =>
    typeof entry === "string"
      ? entry
      : "value" in entry
        ? entry.value
        : entry.type === "group"
          ? `group-${entry.label ?? index}`
          : `separator-${index}`

  function onValueChange(value: string, details: { reason: string }) {
    action = `value:${value}:${details.reason}`
    if (async) {
      remote.setQuery(value)
    }
  }

  function onSubmit(event: SubmitEvent) {
    event.preventDefault()
    submitted = serializeForm(event.target as HTMLFormElement)
  }
</script>

{#snippet dataItem(item: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
})}
  <AutocompleteItem
    class="item"
    value={item.value}
    label={item.label}
    keywords={item.keywords}
    disabled={item.disabled}
  >
    {#if highlight}<AutocompleteItemText>{item.label}</AutocompleteItemText
      >{:else}{item.label}{/if}
  </AutocompleteItem>
{/snippet}

<!-- The list's data, rendered like the composed list: items, and groups with their labels. -->
{#snippet dataItems(entries: ListData)}
  {#each entries as entry, index (keyOf(entry, index))}
    {#if typeof entry === "string"}
      {@render dataItem({ value: entry, label: entry })}
    {:else if "value" in entry}
      {@render dataItem(entry)}
    {:else if entry.type === "separator"}
      <AutocompleteSeparator />
    {:else}
      <AutocompleteGroup>
        <AutocompleteGroupLabel class="label"
          >{entry.label}</AutocompleteGroupLabel
        >
        {@render dataItems(entry.items)}
      </AutocompleteGroup>
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
      <Autocomplete
        {...options}
        name={f.name}
        {container}
        items={dataMode ? items : undefined}
        emptyItems={recent ? f.recent : undefined}
        filter={async ? false : undefined}
        status={async ? remote.state.status : undefined}
        {onValueChange}
        onSubmit={(value) => (action = `submit:${value}`)}
      >
        <AutocompleteLabel class="label">{f.label}</AutocompleteLabel>
        <AutocompleteInput class="input" />
        <AutocompleteTrigger aria-label={f.trigger}>▾</AutocompleteTrigger>
        <AutocompleteClear>{f.clear}</AutocompleteClear>
        <AutocompleteContent class="popup list-popup">
          {#if !nostatus}
            <AutocompleteStatus class="status">
              {#snippet children(state)}{state.loading
                  ? "Loading…"
                  : ""}{/snippet}
            </AutocompleteStatus>
          {/if}
          <AutocompleteEmpty class="empty">{f.empty}</AutocompleteEmpty>
          {#if dataMode}
            <AutocompleteList>
              {#snippet children(state)}
                {@render dataItems(state.items as ListData)}
              {/snippet}
            </AutocompleteList>
          {:else}
            <AutocompleteList>
              {#if grouped}
                {#each f.groups as group (group.label)}
                  <AutocompleteGroup>
                    <AutocompleteGroupLabel class="label"
                      >{group.label}</AutocompleteGroupLabel
                    >
                    {#each group.items as item (item.value)}
                      <AutocompleteItem
                        class="item"
                        value={item.value}
                        label={item.label}
                      >
                        {item.label}
                      </AutocompleteItem>
                    {/each}
                  </AutocompleteGroup>
                {/each}
              {:else}
                {#each list as item (item.value)}
                  <AutocompleteItem
                    class="item"
                    value={item.value}
                    label={item.label}
                    keywords={item.keywords}
                    disabled={item.disabled}
                  >
                    {#if highlight}<AutocompleteItemText
                        >{item.label}</AutocompleteItemText
                      >{:else}{item.label}{/if}
                  </AutocompleteItem>
                {/each}
              {/if}
            </AutocompleteList>
          {/if}
        </AutocompleteContent>
      </Autocomplete>
    </svelte:element>
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>
  <button>After</button>
  <output role="status" aria-label="Last action">{action}</output>
  <output role="status" aria-label="Submitted">{submitted}</output>
</div>
