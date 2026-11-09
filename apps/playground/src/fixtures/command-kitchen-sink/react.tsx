import type { AsyncOptionsStatus } from "@ui-sdk/core/async-options"
import type { CommandData, CommandDataItem } from "@ui-sdk/core/command"
import { useAsyncOptions } from "@ui-sdk/react/async-options"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItems,
  CommandList,
  CommandPage,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
} from "@ui-sdk/react/command"
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import * as React from "react"
import { createRoot } from "react-dom/client"
import * as classes from "./classes"
import { kitchenSink, type Env } from "./shell"
import {
  filterOf,
  listOf,
  pagesOf,
  runner,
  search,
  type Variant,
} from "./variants"

type Remote = {
  items: CommandData
  status: AsyncOptionsStatus
  setQuery: (query: string) => void
}

// Composed commands: CommandItem, CommandGroup and CommandSeparator parts for a list. A command with `items` opens its page.
function Items({
  list,
  onSelect,
}: {
  list: CommandData
  onSelect?: (value: string) => void | Promise<unknown>
}) {
  return list.map((entry, index) => {
    if (typeof entry === "string") {
      return (
        <CommandItem key={entry} className={classes.item} value={entry}>
          {entry}
        </CommandItem>
      )
    }
    if ("type" in entry && entry.type === "separator") {
      return (
        <CommandSeparator
          key={`separator-${index}`}
          className={classes.separator}
        />
      )
    }
    if ("type" in entry && entry.type === "group") {
      return (
        <CommandGroup key={entry.label}>
          <CommandGroupLabel className={classes.groupLabel}>
            {entry.label}
          </CommandGroupLabel>
          <Items list={entry.items} onSelect={onSelect} />
        </CommandGroup>
      )
    }
    const item = entry as CommandDataItem
    return (
      <CommandItem
        key={item.value}
        className={classes.item}
        value={item.value}
        label={item.label}
        keywords={item.keywords}
        disabled={item.disabled}
        shortcut={item.shortcut}
        page={item.items ? item.value : undefined}
        onSelect={onSelect && (() => onSelect(item.value))}
      >
        {(state) => (
          <>
            {item.label}
            {state.pending ? (
              <span className={classes.pending}>Running…</span>
            ) : state.error ? (
              <span className={classes.error}>
                {(state.error as Error).message}
              </span>
            ) : (
              item.shortcut && <CommandShortcut className={classes.shortcut} />
            )}
          </>
        )}
      </CommandItem>
    )
  })
}

function VariantCommand({
  variant,
  env,
  remote,
  onRan,
}: {
  variant: Variant
  env: Env
  remote?: Remote
  onRan?: () => void
}) {
  const {
    defaultValue,
    defaultQuery,
    defaultPages,
    filter,
    status,
    ...options
  } = variant.options ?? {}
  const [value, setValue] = React.useState<string | null>(defaultValue ?? null)
  const [query, setQuery] = React.useState(defaultQuery ?? "")
  const [pages, setPages] = React.useState(defaultPages ?? [])
  const [onAction] = React.useState(() =>
    runner(variant.action, env.log, "onAction")
  )
  const [onSelect] = React.useState(
    () => variant.select && runner(variant.select, env.log, "onSelect")
  )
  const data = variant.mode === "data" || !!remote
  const list = remote ? remote.items : listOf(variant)
  const nested = data ? [] : pagesOf(list)
  return (
    <>
      <Command
        {...options}
        className={variant.dialog ? classes.dialogRoot : classes.root}
        {...(variant.controlled === "value" ? { value } : { defaultValue })}
        {...(variant.controlled === "query" ? { query } : { defaultQuery })}
        {...(variant.controlled === "pages" ? { pages } : { defaultPages })}
        filter={remote ? false : filterOf(variant)}
        status={remote?.status ?? status}
        items={data ? list : undefined}
        controller={env.controller}
        onValueChange={(next, details) => {
          if (variant.controlled === "value") {
            setValue(next)
          }
          env.log(
            `valueChange ${JSON.stringify(next)} #${details.index} (${details.reason})`
          )
        }}
        onQueryChange={(next, details) => {
          if (variant.controlled === "query") {
            setQuery(next)
          }
          remote?.setQuery(next)
          env.log(`queryChange ${JSON.stringify(next)} (${details.reason})`)
        }}
        onPagesChange={(next, details) => {
          setPages(next)
          env.log(`pagesChange ${JSON.stringify(next)} (${details.reason})`)
        }}
        onAction={(next) => {
          onRan?.()
          return onAction(next)
        }}
      >
        {pages.length > 0 && (
          <div className={classes.breadcrumb}>Home / {pages.join(" / ")}</div>
        )}
        <CommandInput
          className={classes.input}
          aria-label={variant.title}
          placeholder="Type a command…"
        />
        {(remote || status) && (
          <CommandStatus className={classes.status}>
            {(state) =>
              state.loading
                ? "Loading…"
                : state.status === "error"
                  ? "Couldn't load commands."
                  : remote
                    ? `${state.count} results`
                    : ""
            }
          </CommandStatus>
        )}
        <CommandEmpty className={classes.empty}>
          {(state) =>
            state.empty && !state.loading ? "No results found." : null
          }
        </CommandEmpty>
        <CommandList className={classes.list}>
          {data ? (
            (state) => <CommandItems items={state.items} />
          ) : nested.length ? (
            <>
              <CommandPage>
                <Items list={list} onSelect={onSelect} />
              </CommandPage>
              {nested.map((page) => (
                <CommandPage key={page.value} value={page.value}>
                  <Items list={page.items} onSelect={onSelect} />
                </CommandPage>
              ))}
            </>
          ) : (
            <Items list={list} onSelect={onSelect} />
          )}
        </CommandList>
      </Command>
      {variant.controlled === "value" && (
        <>
          <span className="text-xs text-neutral-600">
            value: {JSON.stringify(value)}
          </span>
          <button
            type="button"
            className={classes.button}
            onClick={() => setValue("billing")}
          >
            Set “billing”
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
      {variant.controlled === "query" && (
        <>
          <span className="text-xs text-neutral-600">
            query: {JSON.stringify(query)}
          </span>
          <button
            type="button"
            className={classes.button}
            onClick={() => setQuery("cal")}
          >
            Set “cal”
          </button>
          <button
            type="button"
            className={classes.button}
            onClick={() => setQuery("")}
          >
            Empty
          </button>
        </>
      )}
      {variant.controlled === "pages" && (
        <>
          <span className="text-xs text-neutral-600">
            pages: {JSON.stringify(pages)}
          </span>
          <button
            type="button"
            className={classes.button}
            onClick={() => setPages(["theme"])}
          >
            Theme
          </button>
          <button
            type="button"
            className={classes.button}
            onClick={() => setPages(["theme", "accent"])}
          >
            Accent
          </button>
          <button
            type="button"
            className={classes.button}
            onClick={() => setPages([])}
          >
            Home
          </button>
        </>
      )}
    </>
  )
}

// Async results come from a hook, so they get a component of their own.
function AsyncCommand({ variant, env }: { variant: Variant; env: Env }) {
  const remote = useAsyncOptions(search(variant.async!), { immediate: true })
  return <VariantCommand variant={variant} env={env} remote={remote} />
}

// A command palette: the list in a dialog that ⌘K or Ctrl+K opens. Running a command closes it.
function DialogCommand({ variant, env }: { variant: Variant; env: Env }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog
      open={open}
      onOpenChange={(next, details) => {
        setOpen(next)
        env.log(`dialog openChange ${next} (${details.reason})`)
      }}
    >
      <DialogTrigger className={classes.trigger} shortcut="mod+k">
        Open command palette <DialogShortcut className={classes.shortcut} />
      </DialogTrigger>
      <DialogBackdrop className={classes.dialogBackdrop} />
      <DialogContent className={classes.dialogContent}>
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <VariantCommand
          variant={variant}
          env={env}
          onRan={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function mount(root: HTMLElement) {
  kitchenSink(root, "react", (slot, variant, env) =>
    // Every card is its own root, so each gets its own id prefix.
    createRoot(slot, { identifierPrefix: `${variant.id}-` }).render(
      <React.StrictMode>
        {variant.dialog ? (
          <DialogCommand variant={variant} env={env} />
        ) : variant.async ? (
          <AsyncCommand variant={variant} env={env} />
        ) : (
          <VariantCommand variant={variant} env={env} />
        )}
      </React.StrictMode>
    )
  )
}

export { mount }
