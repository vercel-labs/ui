import type {
  CommandData,
  CommandDataItem,
  CommandEmptyState,
  CommandItemState,
  CommandStatusState,
  CommandValueChangeDetails,
} from "@ui-sdk/core/command"
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
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
  useAsyncOptions,
} from "@ui-sdk/vue"
import { createApp, defineComponent, h, ref, type PropType } from "vue"
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

type Select = ((value: string) => void | Promise<unknown>) | undefined

// One composed command, with its shortcut, or what its action is doing.
function item(entry: CommandDataItem, onSelect: Select) {
  return h(
    CommandItem,
    {
      key: entry.value,
      class: classes.item,
      value: entry.value,
      label: entry.label,
      keywords: entry.keywords,
      disabled: entry.disabled,
      shortcut: entry.shortcut,
      page: entry.items ? entry.value : undefined,
      onSelect: onSelect && (() => onSelect(entry.value)),
    },
    {
      default: ({ state }: { state: CommandItemState }) => [
        entry.label,
        state.pending
          ? h("span", { class: classes.pending }, "Running…")
          : state.error
            ? h(
                "span",
                { class: classes.error },
                (state.error as Error).message
              )
            : entry.shortcut && h(CommandShortcut, { class: classes.shortcut }),
      ],
    }
  )
}

// A plain string command.
function plain(entry: string) {
  return h(
    CommandItem,
    { key: entry, class: classes.item, value: entry },
    () => entry
  )
}

// Composed commands: CommandItem, CommandGroup and CommandSeparator parts for a list. Groups hold only commands.
function items(list: CommandData, onSelect: Select) {
  return list.map((entry, index) => {
    if (typeof entry === "string") {
      return plain(entry)
    }
    if ("type" in entry && entry.type === "separator") {
      return h(CommandSeparator, {
        key: `separator-${index}`,
        class: classes.separator,
      })
    }
    if ("type" in entry && entry.type === "group") {
      return h(CommandGroup, { key: entry.label }, () => [
        h(CommandGroupLabel, { class: classes.groupLabel }, () => entry.label),
        ...entry.items.map((child) =>
          typeof child === "string" ? plain(child) : item(child, onSelect)
        ),
      ])
    }
    return item(entry as CommandDataItem, onSelect)
  })
}

const VariantCommand = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
    onRan: Function as PropType<() => void>,
  },
  setup(props) {
    const { variant, env } = props
    const {
      defaultValue,
      defaultQuery,
      defaultPages,
      filter,
      status,
      ...options
    } = variant.options ?? {}
    const value = ref<string | null>(defaultValue ?? null)
    const query = ref(defaultQuery ?? "")
    const pages = ref(defaultPages ?? [])
    const onAction = runner(variant.action, env.log, "onAction")
    const onSelect =
      variant.select && runner(variant.select, env.log, "onSelect")
    // Async results come from a composable, which runs once, in setup.
    const remote = variant.async
      ? useAsyncOptions(search(variant.async), { immediate: true })
      : undefined
    const data = variant.mode === "data" || !!remote

    return () => {
      const list = remote ? remote.state.value.items : listOf(variant)
      const nested = data ? [] : pagesOf(list)
      return [
        h(
          Command,
          // Undefined props fall back to their defaults, which the typed overloads don't allow.
          {
            ...options,
            class: variant.dialog ? classes.dialogRoot : classes.root,
            ...(variant.controlled === "value"
              ? { value: value.value }
              : { defaultValue }),
            ...(variant.controlled === "query"
              ? { query: query.value }
              : { defaultQuery }),
            ...(variant.controlled === "pages"
              ? { pages: pages.value }
              : { defaultPages }),
            filter: remote ? false : filterOf(variant),
            status: remote?.state.value.status ?? status,
            items: data ? list : undefined,
            controller: env.controller,
            "onUpdate:value": (next: string | null) => {
              if (variant.controlled === "value") {
                value.value = next
              }
            },
            "onUpdate:query": (next: string) => {
              if (variant.controlled === "query") {
                query.value = next
              }
            },
            "onUpdate:pages": (next: string[]) => (pages.value = next),
            onValueChange: (
              next: string | null,
              details: CommandValueChangeDetails
            ) =>
              env.log(
                `valueChange ${JSON.stringify(next)} #${details.index} (${details.reason})`
              ),
            onQueryChange: (next: string, details: { reason: string }) => {
              remote?.setQuery(next)
              env.log(`queryChange ${JSON.stringify(next)} (${details.reason})`)
            },
            onPagesChange: (next: string[], details: { reason: string }) =>
              env.log(
                `pagesChange ${JSON.stringify(next)} (${details.reason})`
              ),
            onAction: (next: string) => {
              props.onRan?.()
              return onAction(next)
            },
          } as Record<string, unknown>,
          () => [
            pages.value.length > 0 &&
              h(
                "div",
                { class: classes.breadcrumb },
                `Home / ${pages.value.join(" / ")}`
              ),
            h(CommandInput, {
              class: classes.input,
              "aria-label": variant.title,
              placeholder: "Type a command…",
            }),
            (remote || status) &&
              h(
                CommandStatus,
                { class: classes.status },
                {
                  default: ({ state }: { state: CommandStatusState }) =>
                    state.loading
                      ? "Loading…"
                      : state.status === "error"
                        ? "Couldn't load commands."
                        : remote
                          ? `${state.count} results`
                          : "",
                }
              ),
            h(
              CommandEmpty,
              { class: classes.empty },
              {
                default: ({ state }: { state: CommandEmptyState }) =>
                  state.loading ? null : "No results found.",
              }
            ),
            h(
              CommandList,
              { class: classes.list },
              {
                default: ({ state }: { state: { items: CommandData } }) =>
                  data
                    ? [h(CommandItems, { items: state.items })]
                    : nested.length
                      ? [
                          h(CommandPage, { key: "first" }, () =>
                            items(list, onSelect)
                          ),
                          ...nested.map((page) =>
                            h(
                              CommandPage,
                              { key: page.value, value: page.value },
                              () => items(page.items, onSelect)
                            )
                          ),
                        ]
                      : items(list, onSelect),
              }
            ),
          ]
        ),
        variant.controlled === "value" && [
          h(
            "span",
            { class: "text-xs text-neutral-600" },
            `value: ${JSON.stringify(value.value)}`
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (value.value = "billing"),
            },
            "Set “billing”"
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (value.value = null),
            },
            "Null"
          ),
        ],
        variant.controlled === "query" && [
          h(
            "span",
            { class: "text-xs text-neutral-600" },
            `query: ${JSON.stringify(query.value)}`
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (query.value = "cal"),
            },
            "Set “cal”"
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (query.value = ""),
            },
            "Empty"
          ),
        ],
        variant.controlled === "pages" && [
          h(
            "span",
            { class: "text-xs text-neutral-600" },
            `pages: ${JSON.stringify(pages.value)}`
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (pages.value = ["theme"]),
            },
            "Theme"
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (pages.value = ["theme", "accent"]),
            },
            "Accent"
          ),
          h(
            "button",
            {
              type: "button",
              class: classes.button,
              onClick: () => (pages.value = []),
            },
            "Home"
          ),
        ],
      ]
    }
  },
})

// A command palette: the list in a dialog that ⌘K or Ctrl+K opens. Running a command closes it.
const DialogCommand = defineComponent({
  props: {
    variant: { type: Object as () => Variant, required: true },
    env: { type: Object as () => Env, required: true },
  },
  setup({ variant, env }) {
    const open = ref(false)
    return () =>
      h(
        Dialog,
        {
          open: open.value,
          "onUpdate:open": (next: boolean) => (open.value = next),
          onOpenChange: (next: boolean, details: { reason: string }) =>
            env.log(`dialog openChange ${next} (${details.reason})`),
        },
        () => [
          h(
            DialogTrigger,
            { class: classes.trigger, shortcut: "mod+k" },
            () => [
              "Open command palette ",
              h(DialogShortcut, { class: classes.shortcut }),
            ]
          ),
          h(DialogBackdrop, { class: classes.dialogBackdrop }),
          h(DialogContent, { class: classes.dialogContent }, () => [
            h(DialogTitle, { class: "sr-only" }, () => "Command palette"),
            h(VariantCommand, {
              variant,
              env,
              onRan: () => (open.value = false),
            }),
          ]),
        ]
      )
  },
})

function mount(root: HTMLElement) {
  kitchenSink(root, "vue", (slot, variant, env) => {
    const app = createApp(variant.dialog ? DialogCommand : VariantCommand, {
      variant,
      env,
    })
    // Every card is its own app, so each gets its own id prefix.
    app.config.idPrefix = variant.id
    app.mount(slot)
  })
}

export { mount }
