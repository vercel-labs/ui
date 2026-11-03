import type { AsyncOptionsStatus } from "@ui-sdk/core/async-options"
import type { ListData } from "@ui-sdk/core/combobox"
import { useAsyncOptions } from "@ui-sdk/react/async-options"
import {
  Combobox,
  ComboboxArrow,
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
} from "@ui-sdk/react/combobox"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, show, type Env } from "./shell"
import {
  createHandler,
  defaultValueOf,
  filterOf,
  listOf,
  objectOptions,
  recentCountries,
  sampleValue,
  search,
  type Variant,
} from "./variants"

type Remote = {
  items: ListData<any>
  status: AsyncOptionsStatus
  setQuery: (query: string) => void
  loadMore: () => void
}

// ComboboxItem, ComboboxGroup and ComboboxSeparator parts for a list: the variant's own, or what a
// data combobox shows.
function Items({ list, variant }: { list: ListData<any>; variant: Variant }) {
  return list.map((entry, index) => {
    if (typeof entry === "string") return null
    if ("type" in entry && entry.type === "separator")
      return <ComboboxSeparator key={`separator-${index}`} className={classes.separator} />
    if ("type" in entry && entry.type === "group")
      return (
        <ComboboxGroup key={entry.label}>
          <ComboboxGroupLabel className={classes.groupLabel}>{entry.label}</ComboboxGroupLabel>
          <Items list={entry.items} variant={variant} />
        </ComboboxGroup>
      )
    const item = entry as { value: unknown; label: string; keywords?: string[]; disabled?: boolean }
    // Keyed by label, since values may be objects.
    return (
      <ComboboxItem
        key={item.label}
        className={classes.item}
        value={item.value}
        label={item.label}
        keywords={item.keywords}
        disabled={item.disabled}
      >
        <ComboboxItemIndicator className={classes.indicator} keepMounted={variant.indicatorKeepMounted}>
          ✓
        </ComboboxItemIndicator>
        <ComboboxItemText className={classes.itemText}>{item.label}</ComboboxItemText>
      </ComboboxItem>
    )
  })
}

function VariantCombobox({ variant, env, remote }: { variant: Variant; env: Env; remote?: Remote }) {
  const [value, setValue] = React.useState<unknown>(
    defaultValueOf(variant) ?? (variant.options?.multiple ? [] : null),
  )
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [onCreate] = React.useState(() => variant.create && createHandler(variant.create, env.log))
  const data = variant.mode === "data" || !!remote
  const list = remote ? remote.items : listOf(variant)
  const { defaultValue, filter, ...options } = variant.options ?? {}
  const input = (
    <ComboboxInput
      className={variant.chips ? classes.chipsInput : classes.input}
      placeholder="Search countries…"
    />
  )
  const create = onCreate && (
    <ComboboxCreate className={classes.create} onCreate={onCreate}>
      {(state) =>
        state.pending
          ? `Creating “${state.query}”…`
          : state.error
            ? `${(state.error as Error).message} Try again.`
            : `Create “${state.query}”`
      }
    </ComboboxCreate>
  )
  return (
    <>
      <Combobox<any, boolean>
        {...options}
        {...(variant.list === "objects" && objectOptions)}
        {...(variant.controlled === "value" ? { value } : { defaultValue: defaultValueOf(variant) })}
        {...(variant.controlled === "open" && { open })}
        {...(variant.controlled === "query" && { query })}
        filter={remote ? false : filterOf(variant)}
        status={remote?.status}
        onLoadMore={variant.async === "pages" ? remote?.loadMore : undefined}
        emptyItems={variant.recent ? recentCountries : undefined}
        items={data ? list : undefined}
        controller={env.controller}
        container={env.container}
        onValueChange={(next, details) => {
          if (variant.controlled === "value") setValue(next)
          env.log(`valueChange ${show(next)} (${details.reason})`)
        }}
        onOpenChange={(next, details) => {
          if (variant.controlled === "open") setOpen(next)
          env.log(`openChange ${next} (${details.reason})`)
        }}
        onQueryChange={(next, details) => {
          if (variant.controlled === "query") setQuery(next)
          remote?.setQuery(next)
          env.log(`queryChange ${JSON.stringify(next)} (${details.reason})`)
        }}
        onOpenChangeComplete={(next) => env.log(`openChangeComplete ${next}`)}
        onHighlight={(next, details) => env.log(`highlight ${show(next)} #${details.index}`)}
      >
        <ComboboxLabel className={classes.label}>{variant.title}</ComboboxLabel>
        {variant.chips ? (
          <ComboboxChips className={variant.overflow ? classes.chipsLine : classes.chips}>
            <ComboboxValue>
              {({ value }) =>
                (value as string[]).map((item) => (
                  <ComboboxChip key={item} className={classes.chip} value={item}>
                    {(state) => (
                      <>
                        {state.label}
                        <ComboboxChipRemove
                          className={classes.chipRemove}
                          aria-label={`Remove ${state.label}`}
                        >
                          ×
                        </ComboboxChipRemove>
                      </>
                    )}
                  </ComboboxChip>
                ))
              }
            </ComboboxValue>
            {variant.overflow && <ComboboxChipsOverflow className={classes.overflow} />}
            {input}
          </ComboboxChips>
        ) : (
          input
        )}
        {variant.max && (
          <span className="text-xs text-neutral-600">
            <ComboboxValue maxLabels={variant.max} />
          </span>
        )}
        {variant.trigger && (
          <ComboboxTrigger className={classes.trigger} aria-label="Show countries">
            ▾
          </ComboboxTrigger>
        )}
        {variant.clear && (
          <ComboboxClear className={classes.clear} keepMounted={variant.clear === "keep-mounted"}>
            Clear
          </ComboboxClear>
        )}
        <ComboboxContent className={classes.content(variant.animation, variant.arrow)} {...variant.content}>
          {variant.arrow && <ComboboxArrow className={classes.arrow} />}
          {remote && (
            <ComboboxStatus className={classes.status}>
              {(state) =>
                state.loading
                  ? variant.async === "pages"
                    ? "Loading more…"
                    : "Loading…"
                  : state.status === "error"
                    ? "Couldn't load countries."
                    : `${state.count} results`
              }
            </ComboboxStatus>
          )}
          <ComboboxEmpty className={classes.empty}>
            {(state) => (state.empty && !state.loading ? "No countries found." : null)}
          </ComboboxEmpty>
          <ComboboxList className={variant.arrow ? classes.scrollingList : undefined}>
            {data ? (
              (state) => (
                <>
                  <Items list={state.items as ListData<any>} variant={variant} />
                  {create}
                </>
              )
            ) : (
              <>
                {variant.selectAll && (
                  <ComboboxSelectAll className={classes.selectAll}>Select all</ComboboxSelectAll>
                )}
                <Items list={list} variant={variant} />
                {create}
              </>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {variant.controlled === "value" && (
        <>
          <span className="text-xs text-neutral-600">value: {show(value)}</span>
          <button type="button" className={classes.button} onClick={() => setValue(sampleValue(variant))}>
            Set
          </button>
          <button type="button" className={classes.button} onClick={() => setValue(null)}>
            Null
          </button>
        </>
      )}
      {variant.controlled === "open" && (
        <label className="flex items-center gap-1.5 text-xs text-neutral-600">
          <input type="checkbox" checked={open} onChange={(event) => setOpen(event.target.checked)} />
          open
        </label>
      )}
      {variant.controlled === "query" && (
        <>
          <span className="text-xs text-neutral-600">query: {JSON.stringify(query)}</span>
          <button type="button" className={classes.button} onClick={() => setQuery("ca")}>
            Set “ca”
          </button>
          <button type="button" className={classes.button} onClick={() => setQuery("")}>
            Empty
          </button>
        </>
      )}
    </>
  )
}

// Async options come from a hook, so they get a component of their own.
function AsyncCombobox({ variant, env }: { variant: Variant; env: Env }) {
  const remote = useAsyncOptions(search(variant.async!), { immediate: true })
  return <VariantCombobox variant={variant} env={env} remote={remote} />
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    // Every card is its own root, so each gets its own id prefix.
    createRoot(slot, { identifierPrefix: `${variant.id}-` }).render(
      <React.StrictMode>
        {variant.async ? (
          <AsyncCombobox variant={variant} env={env} />
        ) : (
          <VariantCombobox variant={variant} env={env} />
        )}
      </React.StrictMode>,
    ),
  )
}

export { mount }
