import { useAsyncOptions } from "@ui-sdk/react/async-options"
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
} from "@ui-sdk/react/autocomplete"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  autocompleteFixture as f,
  autocompleteOptions,
  changedItems,
  searchFruits,
} from "tests/fixtures/autocomplete.ts"
import { onItemsChange } from "tests/fixtures/items.ts"
import { serializeForm } from "tests/fixtures/select.ts"

// The list's data, rendered like the composed list: items, and groups with their labels.
function DataItems({
  items,
  highlight,
}: {
  items: ListData
  highlight: boolean
}) {
  return items.map((entry, index) => {
    if (typeof entry === "string") {
      return (
        <DataItem
          key={entry}
          value={entry}
          label={entry}
          highlight={highlight}
        />
      )
    }
    if ("value" in entry) {
      return <DataItem key={entry.value} {...entry} highlight={highlight} />
    }
    if (entry.type === "separator") {
      return <AutocompleteSeparator key={`separator-${index}`} />
    }
    return (
      <AutocompleteGroup key={entry.label}>
        <AutocompleteGroupLabel className="label">
          {entry.label}
        </AutocompleteGroupLabel>
        <DataItems items={entry.items} highlight={highlight} />
      </AutocompleteGroup>
    )
  })
}

function DataItem({
  highlight,
  ...item
}: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
  highlight: boolean
}) {
  return (
    <AutocompleteItem className="item" {...item}>
      {highlight ? (
        <AutocompleteItemText>{item.label}</AutocompleteItemText>
      ) : (
        item.label
      )}
    </AutocompleteItem>
  )
}

function Fixture({ data = false }: { data?: boolean }) {
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
  const [action, setAction] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const remote = useAsyncOptions(searchFruits, { immediate: async })
  const [list, setList] = React.useState<
    { value: string; label: string; keywords?: string[]; disabled?: boolean }[]
  >(f.items)
  // With ?late, there are no items until the first change.
  const [arrived, setArrived] = React.useState(false)
  React.useEffect(
    () =>
      onItemsChange(changedItems, (items) => {
        setList(items)
        setArrived(true)
      }),
    []
  )
  const items = async
    ? remote.items
    : grouped
      ? f.groups.map((group) => ({
          type: "group" as const,
          label: group.label,
          items: group.items,
        }))
      : list
  const control = (
    <Autocomplete
      {...options}
      name={f.name}
      container={container}
      items={
        late
          ? arrived
            ? items
            : undefined
          : data || async || recent
            ? items
            : undefined
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
      <AutocompleteLabel className="label">{f.label}</AutocompleteLabel>
      <AutocompleteInput className="input" />
      <AutocompleteTrigger aria-label={f.trigger}>▾</AutocompleteTrigger>
      <AutocompleteClear>{f.clear}</AutocompleteClear>
      {late ? (
        <AutocompleteContent className="popup list-popup" />
      ) : (
        <AutocompleteContent className="popup list-popup">
          {!nostatus && (
            <AutocompleteStatus className="status">
              {(state) => (state.loading ? "Loading…" : "")}
            </AutocompleteStatus>
          )}
          <AutocompleteEmpty className="empty">{f.empty}</AutocompleteEmpty>
          <AutocompleteList>
            {data || async || recent
              ? (state) => (
                  <DataItems
                    items={state.items as ListData}
                    highlight={highlight}
                  />
                )
              : grouped
                ? f.groups.map((group) => (
                    <AutocompleteGroup key={group.label}>
                      <AutocompleteGroupLabel className="label">
                        {group.label}
                      </AutocompleteGroupLabel>
                      {group.items.map((item) => (
                        <AutocompleteItem
                          key={item.value}
                          className="item"
                          value={item.value}
                          label={item.label}
                        >
                          {item.label}
                        </AutocompleteItem>
                      ))}
                    </AutocompleteGroup>
                  ))
                : list.map((item) => (
                    <AutocompleteItem
                      key={item.value}
                      className="item"
                      value={item.value}
                      label={item.label}
                      keywords={item.keywords}
                      disabled={item.disabled}
                    >
                      {highlight ? (
                        <AutocompleteItemText>
                          {item.label}
                        </AutocompleteItemText>
                      ) : (
                        item.label
                      )}
                    </AutocompleteItem>
                  ))}
          </AutocompleteList>
        </AutocompleteContent>
      )}
    </Autocomplete>
  )
  return (
    <div className="fixture">
      <button>Before</button>
      <form
        className="select-form"
        aria-label={f.formLabel}
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(serializeForm(event.currentTarget))
        }}
      >
        {fieldset ? <fieldset disabled>{control}</fieldset> : control}
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </form>
      <button>After</button>
      <output role="status" aria-label="Last action">
        {action}
      </output>
      <output role="status" aria-label="Submitted">
        {submitted}
      </output>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
