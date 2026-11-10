import { createFilteredListbox } from "./listbox"
import {
  itemKey,
  type ListData,
  type ListFilter,
  type ListHighlightDetails,
} from "./listbox-engine"
import { listStep } from "./listbox-keyboard"
import { optionId } from "./listbox-keys"
import { isApple } from "../platform/platform"
import { isTypeaheadKey } from "../text/typeahead"
import type { PrimitiveContext } from "../kernel/primitive-types"

/**
 * An option as `createListbox` sees it: its key and the props of its newest render.
 * @stable
 */
type ListboxOption = {
  /** The part's key: its `id`, else its `value`. */
  key: string
  /** The props of the part's newest render. Without `items`, `label`, `keywords` and `disabled` describe the option. */
  props: {
    value?: unknown
    label?: string
    keywords?: string[]
    disabled?: boolean
  }
}

/**
 * What `createListbox` takes.
 * @stable
 */
type ListboxBehaviorOptions<State extends object, T = string> = {
  /** The state key that holds the highlighted option's key. Start it at `null`. */
  key: keyof State & string
  /** `"real"` moves focus to the highlighted option. `"virtual"` keeps it where it is, like in an input that points `aria-activedescendant` at `activeId(state)`. Defaults to `"real"`. */
  focus?: "real" | "virtual"
  /** The options as data: items, plain strings, groups and separators. Without it, the bound parts are the options, in document order. */
  items?: () => ListData<T>
  /** The text options are filtered by. Empty shows every option. */
  query?: () => string
  /** How `query` narrows the options. A function that returns a number ranks them too, best first. Defaults to `"contains"`. */
  filter?: () => ListFilter<T>
  /** Whether moving past either end wraps around. Defaults to `true`. */
  loop?: () => boolean
  /** Runs when the highlight moves, with the option's index among those that match, for a virtualizer to scroll to. */
  onHighlight?: (key: string | null, details: ListHighlightDetails) => void
  /** Runs when the highlight reaches the last option, so the next page can load. */
  onEnd?: () => void
}

/**
 * A highlight that moves through options with the keys, the way the WAI-ARIA
 * listbox and combobox patterns ask, and options filtered and ranked by a
 * query. Call it once in `api`, keep it on the api for the slots, and wire
 * the option slot:
 *
 * ```ts
 * option: slot({
 *   role: "option",
 *   focus: "active-descendant",
 *   present: (state, part) => part.api.listbox.shows(part),
 *   attrs: (state, part) => part.api.listbox.attrs(state, part),
 *   on: { pointermove: (event, { key, api }) => api.listbox.highlight(key, { event }) },
 *   bind: (el, part) => part.api.listbox.bind(el, part),
 * })
 * ```
 *
 * With `focus: "virtual"`, the element that keeps focus calls `keydown` and
 * sets `aria-activedescendant` to `activeId(state)`. Choosing an option is
 * yours: write it with `createChange`, or `createSelection` for several.
 * @stable
 */
function createListbox<State extends object, T = string>(
  context: Pick<PrimitiveContext<any, State, any>, "id" | "store">,
  options: ListboxBehaviorOptions<State, T>
) {
  const { id, store } = context
  const { key: stateKey } = options
  const focus = options.focus ?? "real"
  const highlighted = (state = store.get()) => state[stateKey] as string | null
  let lastBound: HTMLElement | undefined
  const metaOf = ({ key, props }: ListboxOption) => ({
    value: props.value ?? key,
    label: props.label,
    keywords: props.keywords,
    disabled: props.disabled,
  })
  const engine = createFilteredListbox({
    store: {
      get: () => ({ highlighted: highlighted() }),
      set: (patch) =>
        store.set({ [stateKey]: patch.highlighted } as Partial<State>),
    },
    focus,
    items: () => options.items?.() as ListData<unknown> | undefined,
    toKey: itemKey,
    filter: () =>
      (options.filter?.() ?? "contains") as ListFilter<unknown> | undefined,
    query: () => options.query?.() ?? "",
    rank: () => typeof options.filter?.() === "function",
    loop: () => options.loop?.() ?? true,
    skipDisabled: true,
    active: () => true,
    container: () =>
      lastBound?.isConnected
        ? (lastBound.closest<HTMLElement>('[role="listbox"]') ?? undefined)
        : undefined,
    scrollRoot: () => undefined,
    onHighlight: (key, index, event) =>
      options.onHighlight?.(key, { index, event }),
    onLastReached: options.onEnd,
  })
  const noItems: ListData<T> = []

  return {
    /** Joins a bound option. Call it from the option slot's `bind` and return its cleanup. */
    bind(el: HTMLElement, part: ListboxOption) {
      lastBound = el
      const unregister = engine.register(part.key, el, () => metaOf(part))
      if (focus === "virtual") {
        return unregister
      }
      // Focus that lands on an option another way, like Tab or a press, moves the highlight there.
      const focused = () => {
        if (highlighted() !== part.key) {
          engine.highlight(part.key, { focus: false })
        }
      }
      el.addEventListener("focus", focused)
      return () => {
        el.removeEventListener("focus", focused)
        unregister()
      }
    },
    /** An option's attributes: its `id`, `data-highlighted` and `aria-disabled`, with `tabindex` for real focus. */
    attrs: (state: State, part: ListboxOption) => ({
      id: optionId(id, part.key),
      tabindex: focus === "real" ? "-1" : undefined,
      "data-highlighted": highlighted(state) === part.key ? "" : undefined,
      "aria-disabled": part.props.disabled ? "true" : undefined,
    }),
    /** The id of the highlighted option, for `aria-activedescendant` with virtual focus. */
    activeId(state: State) {
      const key = highlighted(state)
      return key === null ? undefined : optionId(id, key)
    },
    /**
     * Moves the highlight for the arrows, PageUp and PageDown, and with real
     * focus also Home, End and typing an option's name. Returns the key it
     * moved to, or undefined for a key it leaves alone, like Enter.
     */
    keydown(event: KeyboardEvent) {
      const current = highlighted()
      let to: string | undefined
      if (focus === "real" && (event.key === "Home" || event.key === "End")) {
        to = engine.stepKey(event.key === "Home" ? "first" : "last")
      } else if (
        focus === "real" &&
        isTypeaheadKey(event) &&
        (event.key !== " " || engine.typing())
      ) {
        to = engine.search(event.key, current)?.key
        if (to === undefined) {
          return
        }
      } else {
        const step = listStep(event, { apple: isApple() })
        if (step === undefined) {
          return
        }
        to = engine.stepKey(step)
      }
      event.preventDefault()
      if (to !== undefined) {
        engine.highlight(to, { event })
      }
      return to
    },
    /** Highlights an option, or none with `null`. */
    highlight: (key: string | null, { event }: { event?: Event } = {}) =>
      engine.highlight(key, { event }),
    /** Moves the highlight by a step, or to the first or last option. */
    move: (step: number | "first" | "last", event?: Event) =>
      engine.move(step, event),
    /** The data to render now: `items` filtered by `query`. Empty without `items`. */
    items: () => (engine.visibleData()?.list as ListData<T>) ?? noItems,
    /** Whether a bound option matches `query`. Options from `items` always do, since `items()` already left the others out. */
    shows: (part: ListboxOption) => engine.matches(part.key, metaOf(part)),
    /** How many options match `query`. */
    count: () => engine.count(),
  }
}

/**
 * What `createListbox` returns.
 * @stable
 */
type ListboxBehavior = ReturnType<typeof createListbox>

export {
  createListbox,
  type ListboxBehavior,
  type ListboxBehaviorOptions,
  type ListboxOption,
}
