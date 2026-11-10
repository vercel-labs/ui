import { dev } from "#dev"
import { checkName } from "#name-check"
import { orientationOf } from "../../foundation/focus/collection"
import { createRovingFocus } from "../../foundation/focus/roving-focus"
import { idPart } from "../../foundation/kernel/attrs"
import { keyWhileBound } from "../../foundation/kernel/bound-keys"
import { createController } from "../../foundation/kernel/controller"
import { live } from "../../foundation/kernel/live"
import { definePrimitive } from "../../foundation/kernel/primitive"
import type {
  Named,
  PrimitiveContext,
  PrimitiveOptions,
} from "../../foundation/kernel/primitive-types"
import { selects } from "../../foundation/kernel/selects"

/**
 * Moves focus to an event from outside the chronology, like a "Jump to
 * current step" button. Pass it as the `controller` option.
 * @experimental
 */
function createChronologyController() {
  return createController<{
    /** Moves focus to an event by its `value`, or to the event that holds the tab stop. */
    focus: (value?: string) => void
  }>()
}

/**
 * A controller from `createChronologyController()`. Pass it as the
 * `controller` option.
 * @experimental
 */
type ChronologyController = ReturnType<typeof createChronologyController>

/**
 * Which way the events run, which picks the arrow keys that move between them.
 * @experimental
 */
type ChronologyOrientation = "horizontal" | "vertical"

/**
 * Where an event stands in a process: done, the one in progress, or still to
 * come.
 * @experimental
 */
type ChronologyStatus = "complete" | "current" | "upcoming"

/**
 * The options `chronology` takes. A component takes them as props on its root.
 * @experimental
 */
type ChronologyOptions = {
  /**
   * Which arrow keys move between events: up and down, or left and right.
   * @defaultValue "vertical"
   */
  orientation?: ChronologyOrientation
  /**
   * Whether arrow keys wrap from the last event to the first.
   * @defaultValue true
   */
  loop?: boolean
  /**
   * Whether the events are a feed that loads more as people scroll, rather
   * than a list. Each event becomes an article with its position, and Page
   * Down and Page Up move between them from anywhere inside one.
   * @defaultValue false
   */
  feed?: boolean
  /**
   * Whether a feed is loading or changing events, which sets `aria-busy` so
   * screen readers wait until it's done. Only a feed reads it.
   * @defaultValue false
   */
  busy?: boolean
  /** Focuses an event from anywhere. Create one with `createChronologyController()`. */
  controller?: ChronologyController
} & PrimitiveOptions

/**
 * The props the `item` slot of `chronology` takes.
 * @experimental
 */
type ChronologyItemProps = {
  /** Names the event for the controller's `focus()`. Generated when left out. */
  value?: string
  /** Where the event stands in a process. The `"current"` one sets `aria-current="step"` and takes the tab stop first. */
  status?: ChronologyStatus
}

type PartProps = {
  /** @internal The event's value, from the item it sits in. */
  value?: string
  /** @internal The event's status, from the item it sits in. */
  status?: ChronologyStatus
}

/**
 * The state the `root` slot of `chronology` hands `render` functions and
 * state-based class names.
 * @experimental
 */
type ChronologyState = {
  /** Which way the events run. */
  orientation: ChronologyOrientation
  /** Whether the events are a feed rather than a list. */
  feed: boolean
  /** Whether a feed is loading or changing events. */
  busy: boolean
}

/**
 * The state the `item` slot of `chronology` hands `render` functions and
 * state-based class names.
 * @experimental
 */
type ChronologyItemState = {
  /** Where the event stands in a process, or `undefined` when it has no status. */
  status: ChronologyStatus | undefined
  /** Which way the events run. */
  orientation: ChronologyOrientation
}
/**
 * The state the `marker` slot of `chronology` hands `render` functions and
 * state-based class names: its event's.
 * @experimental
 */
type ChronologyMarkerState = ChronologyItemState
/**
 * The state the `connector` slot of `chronology` hands `render` functions and
 * state-based class names: its event's.
 * @experimental
 */
type ChronologyConnectorState = ChronologyItemState
/**
 * The state the `time` slot of `chronology` hands `render` functions and
 * state-based class names: its event's.
 * @experimental
 */
type ChronologyTimeState = ChronologyItemState
/**
 * The state the `title` slot of `chronology` hands `render` functions and
 * state-based class names: its event's.
 * @experimental
 */
type ChronologyTitleState = ChronologyItemState
/**
 * The state the `description` slot of `chronology` hands `render` functions
 * and state-based class names: its event's.
 * @experimental
 */
type ChronologyDescriptionState = ChronologyItemState

type State = {
  orientation: ChronologyOrientation
  feed: boolean
  busy: boolean
  stop: string | null
  first: string | null
  last: string | null
  // Only a feed writes these, since a list's places come from its markup.
  positions: Record<string, number>
  size: number
  titles: readonly string[]
  times: readonly string[]
  descriptions: readonly string[]
}

const noPositions: Record<string, number> = {}

const fromOptions = (options: ChronologyOptions) => ({
  orientation: orientationOf(options.orientation, "vertical"),
  feed: !!options.feed,
  busy: !!options.busy,
})

const statusAttrs = (status: ChronologyStatus | undefined) => ({
  "data-complete": status === "complete" ? "" : undefined,
  "data-current": status === "current" ? "" : undefined,
  "data-upcoming": status === "upcoming" ? "" : undefined,
})

const pageStep = (event: KeyboardEvent) =>
  event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
    ? undefined
    : event.key === "PageDown"
      ? 1
      : event.key === "PageUp"
        ? -1
        : undefined

const partId = (id: string, part: string, key: string) =>
  `${id}-${part}-${idPart(key)}`

function chronologyApiBody(
  context: PrimitiveContext<ChronologyOptions, State, string>
) {
  const { store, options } = context

  const roving = createRovingFocus<State, ChronologyItemProps>(context, {
    slot: "item",
    key: "stop",
    orientation: () => store.get().orientation,
    loop: () => options().loop ?? true,
    preferred: (item) => item.props?.status === "current",
    onItemsChange: measure,
  })

  function measure() {
    const items = roving.items()
    const keys = items.map((item) => item.key)
    context
      .element("root")
      ?.style.setProperty("--chronology-count", String(keys.length))
    items.forEach((item, index) =>
      item.el.style.setProperty("--chronology-index", String(index))
    )
    const { feed } = store.get()
    store.set({
      first: keys[0] ?? null,
      last: keys[keys.length - 1] ?? null,
      positions: feed
        ? Object.fromEntries(keys.map((key, index) => [key, index + 1]))
        : noPositions,
      size: feed ? keys.length : 0,
    })
  }

  // Arrows move only from the event itself, since a control inside may use
  // them. A feed's Page Down and Page Up move from anywhere in an event, as
  // the APG feed pattern asks.
  function keydown(event: KeyboardEvent, el: HTMLElement) {
    if (event.defaultPrevented) {
      return
    }
    const step = store.get().feed ? pageStep(event) : undefined
    if (step) {
      const items = roving.items()
      const next = items[items.findIndex((item) => item.el === el) + step]
      if (next) {
        event.preventDefault()
        next.el.focus()
      }
      return
    }
    if (event.target === el && !event.shiftKey) {
      roving.keydown(event, el)
    }
  }

  return {
    focus: (value?: string) => roving.focus(value),
    internal: {
      roving,
      measure,
      keydown,
    },
  }
}

const chronologyApi: (
  ...args: Parameters<typeof chronologyApiBody>
) => ChronologyApi = chronologyApiBody

/**
 * `chronology`'s api, which its slots and controller call.
 * Adapters expose it as `api`.
 * @experimental
 */
interface ChronologyApi extends ReturnType<typeof chronologyApiBody> {}

const itemState = (state: State, props: PartProps): ChronologyItemState => ({
  status: props.status,
  orientation: state.orientation,
})

const itemPartAttrs = (state: State, props: PartProps) => ({
  ...statusAttrs(props.status),
  "data-orientation": state.orientation,
})

// Parts inside an event never read the tab stop, which moves with every
// arrow key, or where events sit, which changes as they load.
const insideItem = selects<State, ChronologyApi, PartProps>({
  stop: [],
  first: [],
  last: [],
  positions: [],
  size: [],
  titles: [],
  times: [],
  descriptions: [],
})

const itemProps = {
  value: { kind: "string", from: "item" },
  status: { kind: "string", from: "item.status" },
} as const

const chronologyPrimitive = /* @__PURE__ */ definePrimitive({
  name: "chronology",
  options: {
    orientation: "string",
    loop: "boolean",
    feed: "boolean",
    busy: "boolean",
    controller: "value",
  },
  state: (options: ChronologyOptions): State => ({
    ...fromOptions(options),
    stop: null,
    first: null,
    last: null,
    positions: noPositions,
    size: 0,
    titles: [],
    times: [],
    descriptions: [],
  }),
  live: [
    "first",
    "last",
    "positions",
    "size",
    "titles",
    "times",
    "descriptions",
  ],
  sync: fromOptions,
  api: chronologyApi,
  slots: (slot) => ({
    root: slot<{}, ChronologyState>({
      role: (state) => (state.feed ? "feed" : "list"),
      roles: ["list", "feed"],
      selects: selects({
        stop: [],
        first: [],
        last: [],
        positions: [],
        size: [],
        titles: [],
        times: [],
        descriptions: [],
      }),
      state: (state) => ({
        orientation: state.orientation,
        feed: state.feed,
        busy: state.busy,
      }),
      attrs: (state) => ({
        "aria-busy": state.feed && state.busy ? "true" : undefined,
        "data-orientation": state.orientation,
        "data-busy": state.feed && state.busy ? "" : undefined,
      }),
      bind(el, { api, id, store }) {
        // The APG feed pattern asks for a name.
        if (dev && store.get().feed) {
          checkName(el, "Chronology", { component: "chronology", id })
        }
        api.internal.measure()
        let feed = store.get().feed
        const unsubscribe = store.subscribe(() => {
          if (store.get().feed !== feed) {
            feed = store.get().feed
            queueMicrotask(api.internal.measure)
          }
        })
        if (typeof MutationObserver === "undefined") {
          return unsubscribe
        }
        // Events moved in the page, like a list sorted newest first, change
        // places without binding again. The roving group sorts again first.
        const observer = new MutationObserver(() =>
          queueMicrotask(api.internal.measure)
        )
        observer.observe(el, { childList: true })
        return () => {
          observer.disconnect()
          unsubscribe()
          el.style.removeProperty("--chronology-count")
        }
      },
    }),

    item: slot<ChronologyItemProps, ChronologyItemState>({
      role: (state) => (state.feed ? "article" : "listitem"),
      roles: ["listitem", "article"],
      props: { value: "id", status: "string" },
      selects: selects({
        stop: ({ key }) => [key, null],
        first: ({ key }) => [key],
        last: ({ key }) => [key],
        positions: ({ key }) => [key],
        titles: ({ key }) => [key],
        times: ({ key }) => [key],
        descriptions: ({ key }) => [key],
      }),
      state: (state, { props }) => itemState(state, props),
      attrs: (state, { key, props, api }) => ({
        tabindex: api.internal.roving.tabIndex(state, { key, props }),
        "aria-current": props.status === "current" ? "step" : undefined,
        ...itemPartAttrs(state, props),
      }),
      live: live((state, { id, key }) => {
        const position = state.positions[key]
        const described = [
          state.times.includes(key) && partId(id, "time", key),
          state.descriptions.includes(key) && partId(id, "description", key),
        ].filter(Boolean)
        return {
          "aria-labelledby": state.titles.includes(key)
            ? partId(id, "title", key)
            : undefined,
          "aria-describedby": described.length
            ? described.join(" ")
            : undefined,
          "aria-posinset":
            position === undefined ? undefined : String(position),
          "aria-setsize":
            position === undefined ? undefined : String(state.size),
          "data-first": state.first === key ? "" : undefined,
          "data-last": state.last === key ? "" : undefined,
        }
      }),
      on: {
        keydown: (event, { el, api }) => api.internal.keydown(event, el!),
      },
      bind(el, part) {
        const leave = part.api.internal.roving.bind(el, part)
        return () => {
          leave()
          el.style.removeProperty("--chronology-index")
        }
      },
    }),

    marker: slot<PartProps, ChronologyMarkerState>({
      props: itemProps,
      selects: insideItem,
      state: (state, { props }) => itemState(state, props),
      attrs: (state, { props }) => ({
        "aria-hidden": "true",
        ...itemPartAttrs(state, props),
      }),
    }),

    connector: slot<PartProps, ChronologyConnectorState>({
      props: itemProps,
      selects: insideItem,
      state: (state, { props }) => itemState(state, props),
      attrs: (state, { props }) => ({
        "aria-hidden": "true",
        ...itemPartAttrs(state, props),
      }),
    }),

    time: slot<PartProps, ChronologyTimeState>({
      props: itemProps,
      selects: insideItem,
      state: (state, { props }) => itemState(state, props),
      attrs: (state, { id, key, props }) => ({
        id: partId(id, "time", key),
        ...itemPartAttrs(state, props),
      }),
      bind: (el, { key, store }) => keyWhileBound(store, "times", key),
    }),

    title: slot<PartProps, ChronologyTitleState>({
      props: itemProps,
      selects: insideItem,
      state: (state, { props }) => itemState(state, props),
      attrs: (state, { id, key, props }) => ({
        id: partId(id, "title", key),
        ...itemPartAttrs(state, props),
      }),
      bind: (el, { key, store }) => keyWhileBound(store, "titles", key),
    }),

    description: slot<PartProps, ChronologyDescriptionState>({
      props: itemProps,
      selects: insideItem,
      state: (state, { props }) => itemState(state, props),
      attrs: (state, { id, key, props }) => ({
        id: partId(id, "description", key),
        ...itemPartAttrs(state, props),
      }),
      bind: (el, { key, store }) => keyWhileBound(store, "descriptions", key),
    }),
  }),
})

/**
 * The type of `chronology`.
 * @experimental
 */
interface ChronologyPrimitive extends Named<typeof chronologyPrimitive> {}

/**
 * The chronology primitive, with the slots `root`, `item`, `marker`,
 * `connector`, `time`, `title`, `description`.
 * Render it with an adapter's `createParts`, or compose it inside your own
 * primitive.
 * @experimental
 */
const chronology: ChronologyPrimitive = chronologyPrimitive

export {
  chronology,
  createChronologyController,
  type ChronologyApi,
  type ChronologyConnectorState,
  type ChronologyController,
  type ChronologyDescriptionState,
  type ChronologyItemProps,
  type ChronologyItemState,
  type ChronologyMarkerState,
  type ChronologyOptions,
  type ChronologyOrientation,
  type ChronologyPrimitive,
  type ChronologyState,
  type ChronologyStatus,
  type ChronologyTimeState,
  type ChronologyTitleState,
}
