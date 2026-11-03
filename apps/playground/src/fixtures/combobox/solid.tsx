import { useAsyncOptions } from "@ui-sdk/solid/async-options"
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
  type ListData,
} from "@ui-sdk/solid/combobox"
import { render } from "@solidjs/web"
import type { JSX } from "@solidjs/web"
import { createEffect, createMemo, createSignal, For, Show } from "solid-js"
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

type Item = { value: string; label: string; keywords?: string[]; disabled?: boolean }

function Item(props: Item & { highlight: boolean }) {
  return (
    <ComboboxItem
      class="item"
      value={props.value}
      label={props.label}
      keywords={props.keywords}
      disabled={props.disabled}
    >
      <Show when={props.highlight} fallback={props.label}>
        <ComboboxItemText>{props.label}</ComboboxItemText>
      </Show>
      <ComboboxItemIndicator class="indicator">✓</ComboboxItemIndicator>
    </ComboboxItem>
  )
}

// The list's data, rendered like the composed list: items with their check, and groups with their labels.
function DataItems(props: { items: ListData; highlight: boolean }) {
  return (
    <For each={props.items}>
      {(entry) => {
        if (typeof entry === "string") return <Item value={entry} label={entry} highlight={props.highlight} />
        if ("value" in entry) return <Item {...entry} highlight={props.highlight} />
        if (entry.type === "separator") return <ComboboxSeparator />
        return (
          <ComboboxGroup>
            <ComboboxGroupLabel class="label">{entry.label}</ComboboxGroupLabel>
            <DataItems items={entry.items} highlight={props.highlight} />
          </ComboboxGroup>
        )
      }}
    </For>
  )
}

function Fixture(props: { data?: boolean }) {
  const {
    fieldset,
    grouped,
    create,
    slow,
    async,
    long,
    late,
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
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const [created, setCreated] = createSignal<{ value: string; label: string }[]>([])
  const [list, setList] = createSignal<Item[]>(f.items)
  // With ?late, there are no items until the first change.
  const [arrived, setArrived] = createSignal(false)
  // Listens on the client only, in an effect: the server has no document.
  createEffect(
    () => 0,
    () =>
      onItemsChange(changedItems, (items) => {
        setList(items)
        setArrived(true)
      }),
  )
  const remote = useAsyncOptions(pages ? searchCountryPages : searchCountries, { immediate: async || pages })
  const fromData = () => props.data || async || long || recent || pages
  const all = long ? longItems() : []
  const items = () =>
    async || pages
      ? remote.items
      : long
        ? all
        : grouped
          ? [
              { type: "group" as const, label: f.groups[0].label, items: f.groups[0].items },
              { type: "group" as const, label: f.groups[1].label, items: f.groups[1].items },
            ]
          : [...list(), ...created()]
  const onCreate = async (query: string) => {
    setAction(`create:${query}`)
    await createDelay(slow)
    setCreated((list) => [...list, { value: query.toLowerCase(), label: query }])
  }
  const labels = createMemo(
    () => new Map([...f.items, ...list(), ...created()].map((item) => [item.value, item.label])),
  )
  return (
    <div class="fixture">
      <button>Before</button>
      <form
        class="select-form"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serializeForm(event.currentTarget))
        }}
      >
        <Wrap fieldset={fieldset}>
          <Combobox<string, boolean>
            {...options}
            name={f.name}
            container={container}
            items={late ? (arrived() ? items() : undefined) : fromData() ? items() : undefined}
            emptyItems={recent ? f.recent : undefined}
            filter={async || pages ? false : undefined}
            status={async || pages ? remote.status : undefined}
            onLoadMore={pages ? remote.loadMore : undefined}
            itemToLabel={labelsFromItems ? undefined : (value) => labels().get(value) ?? value}
            onValueChange={(value, details) => {
              if (cancelsValue(value, cancel)) return details.cancel()
              setAction(`value:${Array.isArray(value) ? value.join(",") : String(value)}`)
            }}
            onQueryChange={(query) => (async || pages) && remote.setQuery(query)}
          >
            <ComboboxLabel class="label">{f.label}</ComboboxLabel>
            <Show when={options.multiple} fallback={<ComboboxInput class="input" />}>
              <ComboboxChips class={overflow ? "chips chips-line" : "chips"}>
                <Chips labels={labels()} />
                <Show when={overflow}>
                  <ComboboxChipsOverflow class="chips-overflow" />
                </Show>
                <ComboboxInput class="input" />
              </ComboboxChips>
            </Show>
            <Show when={summary}>
              <output aria-label={f.summary}>
                <ComboboxValue max={summary} />
              </output>
            </Show>
            <ComboboxTrigger aria-label={f.trigger}>▾</ComboboxTrigger>
            <ComboboxClear>{f.clear}</ComboboxClear>
            <Show when={!late} fallback={<ComboboxContent class="popup list-popup" />}>
              <ComboboxContent class={pages ? "popup list-popup list-short" : "popup list-popup"}>
                <Show when={!nostatus}>
                  <ComboboxStatus class="status">
                    {(state) => (state.loading ? (pages ? "Loading more…" : "Loading…") : "")}
                  </ComboboxStatus>
                </Show>
                <ComboboxEmpty class="empty">{f.empty}</ComboboxEmpty>
                <Show
                  when={fromData()}
                  fallback={
                    <ComboboxList>
                      <Show when={selectAll && !grouped}>
                        <ComboboxSelectAll class="item">{f.selectAll}</ComboboxSelectAll>
                      </Show>
                      <Show
                        when={grouped}
                        fallback={
                          // Keyed by value, so replaced items that stay keep their elements, like a React key.
                          <For each={[...list(), ...created()]} keyed={(item) => item.value}>
                            {(item) => <Item {...item()} highlight={highlight} />}
                          </For>
                        }
                      >
                        <For each={f.groups}>
                          {(group) => (
                            <ComboboxGroup>
                              <ComboboxGroupLabel class="label">{group.label}</ComboboxGroupLabel>
                              <Show when={selectAll}>
                                <ComboboxSelectAll class="item">
                                  {f.selectAll} {group.label}
                                </ComboboxSelectAll>
                              </Show>
                              <For each={group.items}>
                                {(item) => <Item {...item} highlight={highlight} />}
                              </For>
                            </ComboboxGroup>
                          )}
                        </For>
                      </Show>
                      <Show when={create}>
                        <ComboboxCreate class="item" onCreate={onCreate} />
                      </Show>
                    </ComboboxList>
                  }
                >
                  <ComboboxList>
                    {(state) => (
                      <>
                        <Show when={selectAll}>
                          <ComboboxSelectAll class="item">{f.selectAll}</ComboboxSelectAll>
                        </Show>
                        <DataItems items={state.items as ListData} highlight={highlight} />
                        <Show when={create}>
                          <ComboboxCreate class="item" onCreate={onCreate} />
                        </Show>
                      </>
                    )}
                  </ComboboxList>
                </Show>
              </ComboboxContent>
            </Show>
          </Combobox>
        </Wrap>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action()}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted()}
      </output>
    </div>
  )
}

// One chip per selected value.
function Chips(props: { labels: Map<string, string> }) {
  const label = (item: string) => props.labels.get(item) ?? item
  return (
    <ComboboxValue>
      {(state) => (
        <For each={state.value as string[]}>
          {(item) => (
            <ComboboxChip class="chip" value={item}>
              {label(item)}
              <ComboboxChipRemove aria-label={`Remove ${label(item)}`}>×</ComboboxChipRemove>
            </ComboboxChip>
          )}
        </For>
      )}
    </ComboboxValue>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

// A disabled fieldset around the control, with ?fieldset.
function Wrap(props: { fieldset: boolean; children: JSX.Element }) {
  return (
    <Show when={props.fieldset} fallback={props.children}>
      <fieldset disabled>{props.children}</fieldset>
    </Show>
  )
}

export { Fixture, mount }
