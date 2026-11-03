import { useAsyncOptions } from "@ui-sdk/react/async-options"
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
} from "@ui-sdk/react/combobox"
import * as React from "react"
import { createRoot } from "react-dom/client"
import { longItems, serializeForm } from "tests/fixtures/select.ts"
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

function Item({
  value,
  label,
  keywords,
  disabled,
  highlight,
}: {
  value: string
  label: string
  keywords?: string[]
  disabled?: boolean
  highlight: boolean
}) {
  return (
    <ComboboxItem className="item" value={value} label={label} keywords={keywords} disabled={disabled}>
      {highlight ? <ComboboxItemText>{label}</ComboboxItemText> : label}
      <ComboboxItemIndicator className="indicator">✓</ComboboxItemIndicator>
    </ComboboxItem>
  )
}

// The list's data, rendered like the composed list: items with their check, and groups with their labels.
function DataItems({ items, highlight }: { items: ListData; highlight: boolean }) {
  return items.map((entry, index) => {
    if (typeof entry === "string")
      return <Item key={entry} value={entry} label={entry} highlight={highlight} />
    if ("value" in entry) return <Item key={entry.value} {...entry} highlight={highlight} />
    if (entry.type === "separator") return <ComboboxSeparator key={`separator-${index}`} />
    return (
      <ComboboxGroup key={entry.label}>
        <ComboboxGroupLabel className="label">{entry.label}</ComboboxGroupLabel>
        <DataItems items={entry.items} highlight={highlight} />
      </ComboboxGroup>
    )
  })
}

function Fixture({ data = false }: { data?: boolean }) {
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
  const [action, setAction] = React.useState("")
  const [submitted, setSubmitted] = React.useState("")
  const [created, setCreated] = React.useState<{ value: string; label: string }[]>([])
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
    [],
  )
  const remote = useAsyncOptions(pages ? searchCountryPages : searchCountries, { immediate: async || pages })
  const fromData = data || async || long || recent || pages
  const items =
    async || pages
      ? remote.items
      : long
        ? longItems()
        : grouped
          ? [
              { type: "group" as const, label: f.groups[0].label, items: f.groups[0].items },
              { type: "group" as const, label: f.groups[1].label, items: f.groups[1].items },
            ]
          : [...list, ...created]
  const onCreate = async (query: string) => {
    setAction(`create:${query}`)
    await createDelay(slow)
    setCreated((list) => [...list, { value: query.toLowerCase(), label: query }])
  }
  const labels = new Map([...f.items, ...list, ...created].map((item) => [item.value, item.label]))
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
        <Wrap fieldset={fieldset}>
          <Combobox<string, boolean>
            {...options}
            name={f.name}
            container={container}
            items={late ? (arrived ? items : undefined) : fromData ? items : undefined}
            emptyItems={recent ? f.recent : undefined}
            filter={async || pages ? false : undefined}
            status={async || pages ? remote.status : undefined}
            onLoadMore={pages ? remote.loadMore : undefined}
            itemToLabel={labelsFromItems ? undefined : (value) => labels.get(value) ?? value}
            onValueChange={(value, details) => {
              if (cancelsValue(value, cancel)) return details.cancel()
              setAction(`value:${Array.isArray(value) ? value.join(",") : String(value)}`)
            }}
            onQueryChange={(query) => (async || pages) && remote.setQuery(query)}
          >
            <ComboboxLabel className="label">{f.label}</ComboboxLabel>
            {options.multiple ? (
              <ComboboxChips className={overflow ? "chips chips-line" : "chips"}>
                <Chips labels={labels} />
                {overflow && <ComboboxChipsOverflow className="chips-overflow" />}
                <ComboboxInput className="input" />
              </ComboboxChips>
            ) : (
              <ComboboxInput className="input" />
            )}
            {summary && (
              <output aria-label={f.summary}>
                <ComboboxValue maxLabels={summary} />
              </output>
            )}
            <ComboboxTrigger aria-label={f.trigger}>▾</ComboboxTrigger>
            <ComboboxClear>{f.clear}</ComboboxClear>
            {late ? (
              <ComboboxContent className="popup list-popup" />
            ) : (
              <ComboboxContent className={pages ? "popup list-popup list-short" : "popup list-popup"}>
                {!nostatus && (
                  <ComboboxStatus className="status">
                    {(state) => (state.loading ? (pages ? "Loading more…" : "Loading…") : "")}
                  </ComboboxStatus>
                )}
                <ComboboxEmpty className="empty">{f.empty}</ComboboxEmpty>
                {fromData ? (
                  <ComboboxList>
                    {(state) => (
                      <>
                        {selectAll && <ComboboxSelectAll className="item">{f.selectAll}</ComboboxSelectAll>}
                        <DataItems items={state.items as ListData} highlight={highlight} />
                        {create && <ComboboxCreate className="item" onCreate={onCreate} />}
                      </>
                    )}
                  </ComboboxList>
                ) : (
                  <ComboboxList>
                    {selectAll && !grouped && (
                      <ComboboxSelectAll className="item">{f.selectAll}</ComboboxSelectAll>
                    )}
                    {grouped
                      ? f.groups.map((group) => (
                          <ComboboxGroup key={group.label}>
                            <ComboboxGroupLabel className="label">{group.label}</ComboboxGroupLabel>
                            {selectAll && (
                              <ComboboxSelectAll className="item">
                                {f.selectAll} {group.label}
                              </ComboboxSelectAll>
                            )}
                            {group.items.map((item) => (
                              <Item key={item.value} {...item} highlight={highlight} />
                            ))}
                          </ComboboxGroup>
                        ))
                      : [...list, ...created].map((item) => (
                          <Item key={item.value} {...item} highlight={highlight} />
                        ))}
                    {create && <ComboboxCreate className="item" onCreate={onCreate} />}
                  </ComboboxList>
                )}
              </ComboboxContent>
            )}
          </Combobox>
        </Wrap>
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

// One chip per selected value.
function Chips({ labels }: { labels: Map<string, string> }) {
  return (
    <ComboboxValue>
      {({ value }) =>
        (value as string[]).map((item) => (
          <ComboboxChip key={item} className="chip" value={item}>
            {labels.get(item) ?? item}
            <ComboboxChipRemove aria-label={`Remove ${labels.get(item) ?? item}`}>×</ComboboxChipRemove>
          </ComboboxChip>
        ))
      }
    </ComboboxValue>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>,
  )
}

// A disabled fieldset around the control, with ?fieldset.
function Wrap({ fieldset, children }: { fieldset: boolean; children: React.ReactNode }) {
  return fieldset ? <fieldset disabled>{children}</fieldset> : <>{children}</>
}

export { Fixture, mount }
