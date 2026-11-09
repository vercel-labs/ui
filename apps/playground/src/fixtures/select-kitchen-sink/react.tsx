import type { ListData } from "@ui-sdk/core/select"
import {
  Select,
  SelectArrow,
  SelectClear,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectSelectAll,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/react/select"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, show, type Env } from "./shell"
import {
  countryOptions,
  defaultValueOf,
  valuePlaceholder,
  listOf,
  recentItems,
  sampleValue,
  type Variant,
} from "./variants"

// SelectItem, SelectGroup and SelectSeparator parts for a list: the variant's own, or what a data
// select shows.
function Items({ list, variant }: { list: ListData<any>; variant: Variant }) {
  return list.map((entry, index) => {
    if (typeof entry === "string") {
      return null
    }
    if ("type" in entry && entry.type === "separator") {
      return (
        <SelectSeparator
          key={`separator-${index}`}
          className={classes.separator}
        />
      )
    }
    if ("type" in entry && entry.type === "group") {
      return (
        <SelectGroup key={entry.label}>
          <SelectGroupLabel className={classes.groupLabel}>
            {entry.label}
          </SelectGroupLabel>
          {variant.selectAll && (
            <SelectSelectAll className={classes.selectAll}>
              All {entry.label}
            </SelectSelectAll>
          )}
          <Items list={entry.items} variant={variant} />
        </SelectGroup>
      )
    }
    // Keyed by label, since values may be objects.
    const item = entry as { value: unknown; label: string; disabled?: boolean }
    return (
      <SelectItem
        key={item.label}
        className={classes.item}
        value={item.value}
        disabled={item.disabled}
      >
        <SelectItemIndicator
          className={classes.indicator}
          keepMounted={variant.indicatorKeepMounted}
        >
          ✓
        </SelectItemIndicator>
        <SelectItemText className="[&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:underline">
          {item.label}
        </SelectItemText>
      </SelectItem>
    )
  })
}

function VariantSelect({ variant, env }: { variant: Variant; env: Env }) {
  const initial =
    defaultValueOf(variant) ?? (variant.options?.multiple ? [] : null)
  const [value, setValue] = React.useState<unknown>(initial)
  const [open, setOpen] = React.useState(false)
  const data = variant.mode === "data"
  const list = listOf(variant)
  const { defaultValue, ...options } = variant.options ?? {}
  return (
    <>
      <Select<any, boolean>
        {...options}
        {...(variant.list === "countries" && countryOptions)}
        {...(variant.controlled === "value"
          ? { value }
          : { defaultValue: defaultValueOf(variant) })}
        {...(variant.controlled === "open" && { open })}
        items={data ? list : undefined}
        emptyItems={variant.recent ? recentItems : undefined}
        controller={env.controller}
        container={env.container}
        onValueChange={(next, details) => {
          if (variant.controlled === "value") {
            setValue(next)
          }
          env.log(`valueChange ${show(next)} (${details.reason})`)
        }}
        onOpenChange={(next, details) => {
          if (variant.controlled === "open") {
            setOpen(next)
          }
          env.log(`openChange ${next} (${details.reason})`)
        }}
        onOpenChangeComplete={(next) => env.log(`openChangeComplete ${next}`)}
        onHighlight={(next, details) =>
          env.log(`highlight ${show(next)} #${details.index}`)
        }
      >
        <SelectLabel className={classes.label}>{variant.title}</SelectLabel>
        <SelectTrigger
          className={classes.trigger}
          disabled={variant.triggerDisabled}
        >
          {/* SelectValue's own placeholder, unless the variant shows the select's. */}
          <SelectValue
            className={classes.value}
            placeholder={valuePlaceholder(variant)}
            maxLabels={variant.max}
          />
          <span className={classes.chevron} aria-hidden="true">
            ▾
          </span>
        </SelectTrigger>
        {variant.clear && (
          <SelectClear
            className={classes.clear}
            keepMounted={variant.clear === "keep-mounted"}
          >
            Clear
          </SelectClear>
        )}
        {variant.search ? (
          <SelectContent
            className={classes.content(variant.animation)}
            {...variant.content}
            anchor={env.anchor}
          >
            <SelectInput
              className={classes.search}
              aria-label="Search"
              placeholder="Search…"
            />
            <SelectEmpty className={classes.empty}>Nothing found</SelectEmpty>
            <SelectList>
              {data ? (
                (state) => (
                  <Items
                    list={state.items as ListData<any>}
                    variant={variant}
                  />
                )
              ) : (
                <>
                  {variant.selectAll && variant.list !== "grouped" && (
                    <SelectSelectAll className={classes.selectAll}>
                      Select all
                    </SelectSelectAll>
                  )}
                  <Items list={list} variant={variant} />
                </>
              )}
            </SelectList>
          </SelectContent>
        ) : (
          <SelectContent
            className={classes.content(variant.animation, variant.arrow)}
            {...variant.content}
            anchor={env.anchor}
          >
            {data ? (
              (state) => (
                <Items list={state.items as ListData<any>} variant={variant} />
              )
            ) : (
              <>
                {variant.arrow && <SelectArrow className={classes.arrow} />}
                {variant.selectAll && variant.list !== "grouped" && (
                  <SelectSelectAll className={classes.selectAll}>
                    Select all
                  </SelectSelectAll>
                )}
                <Items list={list} variant={variant} />
              </>
            )}
          </SelectContent>
        )}
      </Select>
      {variant.controlled === "value" && (
        <>
          <span className="text-xs text-neutral-600">value: {show(value)}</span>
          <button
            type="button"
            className={classes.button}
            onClick={() => setValue(sampleValue(variant))}
          >
            Set
          </button>
          <button
            type="button"
            className={classes.button}
            onClick={() => setValue(null)}
          >
            Null
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

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    // Every card is its own root, so each gets its own id prefix.
    createRoot(slot, { identifierPrefix: `${variant.id}-` }).render(
      <React.StrictMode>
        <VariantSelect variant={variant} env={env} />
      </React.StrictMode>
    )
  )
}

export { mount }
