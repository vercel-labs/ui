import { useAsyncOptions } from "@ui-sdk/solid/async-options"
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
  type ListData,
} from "@ui-sdk/solid/autocomplete"
import { render } from "@solidjs/web"
import { createEffect, createSignal, For, Show } from "solid-js"
import {
  autocompleteFixture as f,
  autocompleteOptions,
  changedItems,
  searchFruits,
} from "tests/fixtures/autocomplete.ts"
import { onItemsChange } from "tests/fixtures/items.ts"
import { serializeForm } from "tests/fixtures/select.ts"

type Item = {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
}

// The list's data, rendered like the composed list: items, and groups with their labels.
function DataItems(props: { items: ListData; highlight: boolean }) {
  return (
    <For each={props.items}>
      {(entry) => {
        if (typeof entry === "string") {
          return (
            <DataItem value={entry} label={entry} highlight={props.highlight} />
          )
        }
        if ("value" in entry) {
          return <DataItem {...entry} highlight={props.highlight} />
        }
        if (entry.type === "separator") {
          return <AutocompleteSeparator />
        }
        return (
          <AutocompleteGroup>
            <AutocompleteGroupLabel class="label">
              {entry.label}
            </AutocompleteGroupLabel>
            <DataItems items={entry.items} highlight={props.highlight} />
          </AutocompleteGroup>
        )
      }}
    </For>
  )
}

function DataItem(props: Item & { highlight: boolean }) {
  return (
    <AutocompleteItem
      class="item"
      value={props.value}
      label={props.label}
      keywords={props.keywords}
      disabled={props.disabled}
    >
      <Show when={props.highlight} fallback={props.label}>
        <AutocompleteItemText>{props.label}</AutocompleteItemText>
      </Show>
    </AutocompleteItem>
  )
}

function Fixture(props: { data?: boolean }) {
  const {
    fieldset,
    grouped,
    async,
    late,
    container,
    highlight,
    recent,
    nostatus,
    ...options
  } = autocompleteOptions()
  const [action, setAction] = createSignal("")
  const [submitted, setSubmitted] = createSignal("")
  const remote = useAsyncOptions(searchFruits, { immediate: async })
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
      })
  )
  const data = () => props.data || async || recent
  const items = () =>
    async
      ? remote.items
      : grouped
        ? f.groups.map((group) => ({
            type: "group" as const,
            label: group.label,
            items: group.items,
          }))
        : list()
  const control = () => (
    <Autocomplete
      {...options}
      name={f.name}
      container={container}
      items={
        late ? (arrived() ? items() : undefined) : data() ? items() : undefined
      }
      emptyItems={recent ? f.recent : undefined}
      filter={async ? false : undefined}
      status={async ? remote.status : undefined}
      onValueChange={(value, details) => {
        setAction(`value:${value}:${details.reason}`)
        if (async) {
          remote.setQuery(value)
        }
      }}
      onSubmit={(value) => setAction(`submit:${value}`)}
    >
      <AutocompleteLabel class="label">{f.label}</AutocompleteLabel>
      <AutocompleteInput class="input" />
      <AutocompleteTrigger aria-label={f.trigger}>▾</AutocompleteTrigger>
      <AutocompleteClear>{f.clear}</AutocompleteClear>
      <Show
        when={!late}
        fallback={<AutocompleteContent class="popup list-popup" />}
      >
        <AutocompleteContent class="popup list-popup">
          <Show when={!nostatus}>
            <AutocompleteStatus class="status">
              {(state) => (state.loading ? "Loading…" : "")}
            </AutocompleteStatus>
          </Show>
          <AutocompleteEmpty class="empty">{f.empty}</AutocompleteEmpty>
          <Show
            when={data()}
            fallback={
              <AutocompleteList>
                <Show
                  when={grouped}
                  fallback={
                    // Keyed by value, so replaced items that stay keep their elements, like a React key.
                    <For each={list()} keyed={(item) => item.value}>
                      {(item) => (
                        <AutocompleteItem
                          class="item"
                          value={item().value}
                          label={item().label}
                          keywords={item().keywords}
                          disabled={item().disabled}
                        >
                          <Show when={highlight} fallback={item().label}>
                            <AutocompleteItemText>
                              {item().label}
                            </AutocompleteItemText>
                          </Show>
                        </AutocompleteItem>
                      )}
                    </For>
                  }
                >
                  <For each={f.groups}>
                    {(group) => (
                      <AutocompleteGroup>
                        <AutocompleteGroupLabel class="label">
                          {group.label}
                        </AutocompleteGroupLabel>
                        <For each={group.items}>
                          {(item) => (
                            <AutocompleteItem
                              class="item"
                              value={item.value}
                              label={item.label}
                            >
                              {item.label}
                            </AutocompleteItem>
                          )}
                        </For>
                      </AutocompleteGroup>
                    )}
                  </For>
                </Show>
              </AutocompleteList>
            }
          >
            <AutocompleteList>
              {(state) => (
                <DataItems
                  items={state.items as ListData}
                  highlight={highlight}
                />
              )}
            </AutocompleteList>
          </Show>
        </AutocompleteContent>
      </Show>
    </Autocomplete>
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
        <Show when={fieldset} fallback={control()}>
          <fieldset disabled>{control()}</fieldset>
        </Show>
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

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
