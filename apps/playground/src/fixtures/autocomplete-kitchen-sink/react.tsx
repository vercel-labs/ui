import type { AsyncOptionsStatus } from "@ui-sdk/core/async-options"
import type { ListData } from "@ui-sdk/core/autocomplete"
import { useAsyncOptions } from "@ui-sdk/react/async-options"
import {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
} from "@ui-sdk/react/autocomplete"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import { anchorOf, filterOf, listOf, search, type Variant } from "./variants"

type Remote = {
  items: ListData<string>
  status: AsyncOptionsStatus
  setQuery: (query: string) => void
}

// AutocompleteItem, AutocompleteGroup and AutocompleteSeparator parts for a list: the variant's own,
// or what a data autocomplete shows.
function Items({ list }: { list: ListData<string> }) {
  return list.map((entry, index) => {
    if (typeof entry === "string") {
      return null
    }
    if ("type" in entry && entry.type === "separator") {
      return (
        <AutocompleteSeparator
          key={`separator-${index}`}
          className={classes.separator}
        />
      )
    }
    if ("type" in entry && entry.type === "group") {
      return (
        <AutocompleteGroup key={entry.label}>
          <AutocompleteGroupLabel className={classes.groupLabel}>
            {entry.label}
          </AutocompleteGroupLabel>
          <Items list={entry.items} />
        </AutocompleteGroup>
      )
    }
    const item = entry as {
      value: string
      label: string
      keywords?: string[]
      disabled?: boolean
    }
    return (
      <AutocompleteItem
        key={item.value}
        className={classes.item}
        value={item.value}
        label={item.label}
        keywords={item.keywords}
        disabled={item.disabled}
      >
        {item.label}
      </AutocompleteItem>
    )
  })
}

function VariantAutocomplete({
  variant,
  env,
  remote,
}: {
  variant: Variant
  env: Env
  remote?: Remote
}) {
  const [value, setValue] = React.useState(variant.options?.defaultValue ?? "")
  const [open, setOpen] = React.useState(false)
  const data = variant.mode === "data" || !!remote
  const list = remote ? remote.items : listOf(variant)
  const { defaultValue, filter, ...options } = variant.options ?? {}
  return (
    <>
      <Autocomplete
        {...options}
        {...(variant.controlled === "value" ? { value } : { defaultValue })}
        {...(variant.controlled === "open" && { open })}
        filter={remote ? false : filterOf(variant)}
        status={remote?.status}
        items={data ? list : undefined}
        controller={env.controller}
        container={env.container}
        onValueChange={(next, details) => {
          if (variant.controlled === "value") {
            setValue(next)
          }
          remote?.setQuery(next)
          env.log(`valueChange ${JSON.stringify(next)} (${details.reason})`)
        }}
        onOpenChange={(next, details) => {
          if (variant.controlled === "open") {
            setOpen(next)
          }
          env.log(`openChange ${next} (${details.reason})`)
        }}
        onOpenChangeComplete={(next) => env.log(`openChangeComplete ${next}`)}
        onHighlight={(next, details) =>
          env.log(`highlight ${JSON.stringify(next)} #${details.index}`)
        }
        onSubmit={(next) => env.log(`onSubmit ${JSON.stringify(next)}`)}
      >
        <AutocompleteLabel className={classes.label}>
          {variant.title}
        </AutocompleteLabel>
        <AutocompleteInput
          className={classes.input}
          placeholder="Search fruits…"
        />
        {variant.trigger && (
          <AutocompleteTrigger
            className={classes.trigger}
            aria-label="Show fruits"
          >
            ▾
          </AutocompleteTrigger>
        )}
        {variant.clear && (
          <AutocompleteClear
            className={classes.clear}
            aria-label="Clear"
            keepMounted={variant.clear === "keep-mounted"}
          >
            Clear
          </AutocompleteClear>
        )}
        <AutocompleteContent
          className={classes.content(variant.animation, variant.arrow)}
          {...variant.content}
          anchor={anchorOf(variant)}
        >
          {variant.arrow && <AutocompleteArrow className={classes.arrow} />}
          {remote && (
            <AutocompleteStatus className={classes.status}>
              {(state) =>
                state.loading
                  ? "Loading…"
                  : state.status === "error"
                    ? "Couldn't load fruits."
                    : `${state.count} results`
              }
            </AutocompleteStatus>
          )}
          <AutocompleteEmpty className={classes.empty}>
            {(state) =>
              state.empty && !state.loading ? "No fruits found." : null
            }
          </AutocompleteEmpty>
          <AutocompleteList
            className={variant.arrow ? classes.scrollingList : undefined}
          >
            {data ? (
              (state) => <Items list={state.items as ListData<string>} />
            ) : (
              <Items list={list} />
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      {variant.controlled === "value" && (
        <>
          <span className="text-xs text-neutral-600">
            value: {JSON.stringify(value)}
          </span>
          <button
            type="button"
            className={classes.button}
            onClick={() => setValue("Mango")}
          >
            Set “Mango”
          </button>
          <button
            type="button"
            className={classes.button}
            onClick={() => setValue("")}
          >
            Empty
          </button>
        </>
      )}
      {variant.controlled === "open" && (
        <label className="flex items-center gap-1.5 text-xs text-neutral-600">
          <input
            type="checkbox"
            checked={open}
            onChange={(event) => setOpen(event.target.checked)}
          />
          open
        </label>
      )}
    </>
  )
}

// Async suggestions come from a hook, so they get a component of their own.
function AsyncAutocomplete({ variant, env }: { variant: Variant; env: Env }) {
  const remote = useAsyncOptions(search(variant.async!), { immediate: true })
  return <VariantAutocomplete variant={variant} env={env} remote={remote} />
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    // Every card is its own root, so each gets its own id prefix.
    createRoot(slot, { identifierPrefix: `${variant.id}-` }).render(
      <React.StrictMode>
        {variant.async ? (
          <AsyncAutocomplete variant={variant} env={env} />
        ) : (
          <VariantAutocomplete variant={variant} env={env} />
        )}
      </React.StrictMode>
    )
  )
}

export { mount }
