import * as React from "react"
import {
  createChange,
  createHistory,
  createInlineEdit,
  createSpans,
  css,
  definePrimitive,
  matchesShortcut,
  stackSpans,
  type ChangeDetails,
  type Span,
  type SpanAction,
  type SpansDraft,
  type SpansReason,
} from "@ui-sdk/core"
import { createParts, usePart, type PartProps } from "@ui-sdk/react/primitive"

type CalendarEvent = Span & { title: string; tone?: string }

type WeekCalendarEventsChangeReason = SpansReason | "rename" | "undo" | "redo"

type WeekCalendarOptions = {
  events?: CalendarEvent[]
  defaultEvents?: CalendarEvent[]
  onEventsChange?: (events: CalendarEvent[], details: ChangeDetails<WeekCalendarEventsChangeReason>) => void
  min?: number
  max?: number
  step?: number
  size?: number
  createEvent?: (span: Span) => CalendarEvent
}

type WeekCalendarState = {
  events: CalendarEvent[]
  draft: SpansDraft<CalendarEvent> | null
  editing: string | null
  canUndo: boolean
  canRedo: boolean
}

type WeekCalendarRootState = { events: CalendarEvent[] }
type WeekCalendarDayState = { events: CalendarEvent[] }
type WeekCalendarEventState = {
  event: CalendarEvent
  action: SpanAction | undefined
  editing: boolean
}
type WeekCalendarActionState = { disabled: boolean }

const formatTime = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`

let made = 0

const weekCalendar = /* @__PURE__ */ definePrimitive({
  name: "week-calendar",
  options: {
    events: "value",
    defaultEvents: "value",
    onEventsChange: "callback",
    min: "number",
    max: "number",
    step: "number",
    size: "number",
    createEvent: "value",
  },
  state: (options: WeekCalendarOptions): WeekCalendarState => ({
    events: options.events ?? options.defaultEvents ?? [],
    draft: null,
    editing: null,
    canUndo: false,
    canRedo: false,
  }),
  sync: (options) => (options.events === undefined ? {} : { events: options.events }),
  api: (context) => {
    const { store } = context
    const change = createChange(context)
    const history = createHistory(store.get().events)
    const eventElements = new Map<string, HTMLElement>()
    const syncHistory = () => store.set({ canUndo: history.canUndo(), canRedo: history.canRedo() })
    const commit = (
      events: CalendarEvent[],
      details: { reason: WeekCalendarEventsChangeReason; event?: Event },
    ) => {
      if (!change("events", events, details)) return false
      history.record(events)
      syncHistory()
      return true
    }
    const dayLabel = (day: string) => context.props<{ label?: string }>("day", day)?.label ?? day
    const label = (event: CalendarEvent) =>
      `${event.title}, ${dayLabel(event.track)} ${formatTime(event.start)} to ${formatTime(event.end)}`

    const spans = createSpans<WeekCalendarState, CalendarEvent>(context, {
      key: "events",
      draft: "draft",
      set: (events, details) => {
        if (!commit(events, details)) return false
        if (details.action === "draw")
          setTimeout(() => {
            eventElements.get(details.id)?.focus()
            edit.start(details.id)
          })
        return true
      },
      min: () => context.options().min ?? 480,
      max: () => context.options().max ?? 1080,
      step: () => context.options().step ?? 15,
      size: () => context.options().size ?? 60,
      create: (span) =>
        context.options().createEvent?.(span) ?? { ...span, id: `event-${++made}`, title: "New event" },
      label,
    })
    const edit = createInlineEdit<WeekCalendarState>(context, {
      key: "editing",
      value: (id) => store.get().events.find((event) => event.id === id)?.title ?? "",
      commit: (id, text, details) =>
        !!text.trim() &&
        commit(
          store.get().events.map((event) => (event.id === id ? { ...event, title: text.trim() } : event)),
          { reason: "rename", event: details.event },
        ),
    })
    const travel = (events: CalendarEvent[] | undefined, reason: "undo" | "redo", event?: Event) => {
      if (events) change("events", events, { reason, event })
      syncHistory()
    }

    const api = {
      spans,
      edit,
      label,
      undo: (event?: Event) => travel(history.undo(), "undo", event),
      redo: (event?: Event) => travel(history.redo(), "redo", event),
      bindDay: (el: HTMLElement, day: string) => spans.bindTrack(el, day),
      bindEvent(el: HTMLElement, id: string) {
        eventElements.set(id, el)
        const unbind = spans.bindSpan(el, id)
        return () => {
          if (eventElements.get(id) === el) eventElements.delete(id)
          unbind()
        }
      },
      eventKeydown(event: KeyboardEvent, id: string) {
        if (store.get().editing) return
        if (!spans.keydown(event, id)) edit.keydown(event, id)
      },
      rootKeydown(event: KeyboardEvent) {
        if (store.get().draft || store.get().editing) return
        if (matchesShortcut(event, "mod+z")) api.undo(event)
        else if (matchesShortcut(event, "mod+shift+z") || matchesShortcut(event, "control+y")) api.redo(event)
        else return
        event.preventDefault()
      },
    }
    return api
  },
  slots: (slot) => ({
    root: slot<{}, WeekCalendarRootState>({
      state: (state, { api }) => ({ events: api.spans.spans(state) }),
      attrs: (_state, { id }) => ({ "aria-describedby": `${id}-instructions` }),
      on: { keydown: (event, { api }) => api.rootKeydown(event) },
    }),
    day: slot<{ value: string; label: string }, WeekCalendarDayState>({
      props: { value: "string", label: "string" },
      state: (state, { api, key }) => ({ events: api.spans.spansOn(state, key) }),
      attrs: (_state, { props }) => ({
        role: "group",
        "aria-label": props.label,
        style: css({ position: "relative", "touch-action": "pan-y" }),
      }),
      bind: (el, { api, key }) => api.bindDay(el, key),
      on: { pointerdown: (event, { api, key }) => api.spans.trackPointerdown(event, key) },
    }),
    event: slot<{ value: string }, WeekCalendarEventState>({
      props: { value: "string" },
      present: (state, { api, key }) => api.spans.spans(state).some((event) => event.id === key),
      state: (state, { api, key }) => ({
        event: api.spans.spans(state).find((event) => event.id === key)!,
        action: api.spans.action(state, key),
        editing: state.editing === key,
      }),
      attrs: (state, { api, key }) => {
        const events = api.spans.spans(state)
        const event = events.find((other) => other.id === key)!
        const lanes = stackSpans(events.filter((other) => other.track === event.track))
        return {
          ...api.spans.spanAttrs(state, key),
          role: "button",
          tabindex: "0",
          "aria-roledescription": "event",
          "aria-label": api.label(event),
          style: `${api.spans.spanStyle(event, lanes.get(key))};touch-action:none`,
        }
      },
      bind: (el, { api, key }) => api.bindEvent(el, key),
      on: {
        pointerdown: (event, { api, key }) => api.spans.spanPointerdown(event, key),
        keydown: (event, { api, key }) => api.eventKeydown(event, key),
        dblclick: (event, { api, key }) => api.edit.dblclick(event, key),
      },
    }),
    "event-edge": slot<{ edge: "start" | "end" }>({
      props: { edge: "string" },
      attrs: (_state, { props }) => ({ "data-span-edge": props.edge, "aria-hidden": "true" }),
    }),
    "event-input": slot<{ value: string }>({
      props: { value: { kind: "string", from: "event" } },
      present: (state, { key }) => state.editing === key,
      attrs: () => ({ "aria-label": "Event title" }),
      on: {
        keydown: (event, { api }) => api.edit.inputKeydown(event),
        focusout: (event, { api }) => api.edit.end("focus-out", event),
        pointerdown: (event) => event.stopPropagation(),
      },
      bind: (el, { api }) => api.edit.bindInput(el as HTMLInputElement),
    }),
    undo: slot<{}, WeekCalendarActionState>({
      state: (state) => ({ disabled: !state.canUndo }),
      attrs: (state) => ({ type: "button", disabled: state.canUndo ? undefined : "" }),
      press: ({ api }, event) => api.undo(event),
    }),
    redo: slot<{}, WeekCalendarActionState>({
      state: (state) => ({ disabled: !state.canRedo }),
      attrs: (state) => ({ type: "button", disabled: state.canRedo ? undefined : "" }),
      press: ({ api }, event) => api.redo(event),
    }),
    instructions: slot({ attrs: (_state, { id }) => ({ id: `${id}-instructions`, hidden: "" }) }),
  }),
})

const parts = createParts(weekCalendar, {
  root: "div",
  day: "div",
  "event-edge": "div",
  undo: "button",
  redo: "button",
  instructions: "div",
})

const EventContext = React.createContext<string | null>(null)

const WeekCalendar = parts.Root

const WeekCalendarDay = parts.Day

function WeekCalendarEvent({
  value,
  ...props
}: { value: string } & PartProps<"div", WeekCalendarEventState>) {
  return (
    <EventContext.Provider value={value}>
      {usePart(weekCalendar, "event", { value }, props)}
    </EventContext.Provider>
  )
}

const WeekCalendarEventEdge = parts.EventEdge

function WeekCalendarEventInput(props: PartProps<"input">) {
  const value = React.useContext(EventContext)
  if (value === null) throw new Error("WeekCalendarEventInput must be used inside <WeekCalendarEvent>.")
  return usePart(weekCalendar, "event-input", { value }, props, "input")
}

const WeekCalendarUndo = parts.Undo

const WeekCalendarRedo = parts.Redo

const WeekCalendarInstructions = parts.Instructions

const days = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
]

const tones = {
  sky: "border-sky-500 bg-sky-500/15 text-sky-950 dark:text-sky-100",
  violet: "border-violet-500 bg-violet-500/15 text-violet-950 dark:text-violet-100",
  emerald: "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-100",
  amber: "border-amber-500 bg-amber-500/15 text-amber-950 dark:text-amber-100",
}

const defaultEvents: CalendarEvent[] = [
  { id: "e1", track: "mon", start: 540, end: 570, title: "Standup", tone: "sky" },
  { id: "e2", track: "mon", start: 600, end: 690, title: "Design review", tone: "violet" },
  { id: "e3", track: "mon", start: 630, end: 720, title: "1:1 with Sam", tone: "emerald" },
  { id: "e4", track: "tue", start: 540, end: 570, title: "Standup", tone: "sky" },
  { id: "e5", track: "tue", start: 780, end: 900, title: "Focus time", tone: "amber" },
  { id: "e6", track: "wed", start: 540, end: 570, title: "Standup", tone: "sky" },
  { id: "e7", track: "wed", start: 840, end: 900, title: "Ship primitives", tone: "violet" },
  { id: "e8", track: "thu", start: 660, end: 750, title: "Workshop", tone: "emerald" },
  { id: "e9", track: "fri", start: 540, end: 570, title: "Standup", tone: "sky" },
  { id: "e10", track: "fri", start: 960, end: 1020, title: "Demo day", tone: "violet" },
]

const min = 8 * 60
const max = 18 * 60
const hour = 48
const button = "h-8 rounded-md border border-border px-3 text-sm disabled:opacity-50"

function Example() {
  return (
    <WeekCalendar
      defaultEvents={defaultEvents}
      min={min}
      max={max}
      aria-label="Week"
      className="flex w-full max-w-3xl flex-col gap-2 text-sm"
    >
      <div className="flex items-center gap-2">
        <WeekCalendarUndo className={button}>Undo</WeekCalendarUndo>
        <WeekCalendarRedo className={button}>Redo</WeekCalendarRedo>
        <span className="text-muted-foreground">Drag a day to add an event.</span>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] border-b border-border bg-muted/40">
          <span />
          {days.map((day) => (
            <span
              key={day.value}
              aria-hidden="true"
              className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {day.label.slice(0, 3)}
            </span>
          ))}
        </div>
        <div className="h-96 overflow-y-auto">
          <div
            className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))]"
            style={{ height: ((max - min) / 60) * hour }}
          >
            <div aria-hidden="true" className="relative">
              {Array.from({ length: (max - min) / 60 }, (_, i) => (
                <span
                  key={i}
                  className="absolute right-1.5 text-[10px] text-muted-foreground"
                  style={{ top: i * hour }}
                >
                  {formatTime(min + i * 60)}
                </span>
              ))}
            </div>
            {days.map((day) => (
              <WeekCalendarDay
                key={day.value}
                value={day.value}
                label={day.label}
                className="border-l border-border bg-[repeating-linear-gradient(to_bottom,var(--border)_0_1px,transparent_1px_48px)]"
              >
                {({ events }) =>
                  events.map((event) => (
                    <WeekCalendarEvent
                      key={event.id}
                      value={event.id}
                      className={`flex cursor-grab flex-col overflow-hidden rounded-md border-l-2 px-1.5 py-0.5 text-xs outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 data-dragging:z-10 data-dragging:cursor-grabbing data-dragging:shadow-lg data-drawing:opacity-80 data-resizing:z-10 ${tones[(event.tone as keyof typeof tones) ?? "sky"] ?? tones.sky}`}
                    >
                      {({ editing }) => (
                        <>
                          <WeekCalendarEventEdge
                            edge="start"
                            className="absolute inset-x-0 top-0 h-1.5 cursor-ns-resize"
                          />
                          {editing ? (
                            <WeekCalendarEventInput className="w-full min-w-0 rounded-sm bg-background px-1 font-medium text-foreground outline-none" />
                          ) : (
                            <span className="truncate font-medium">{event.title}</span>
                          )}
                          <span className="truncate opacity-70">
                            {formatTime(event.start)} – {formatTime(event.end)}
                          </span>
                          <WeekCalendarEventEdge
                            edge="end"
                            className="absolute inset-x-0 bottom-0 h-1.5 cursor-ns-resize"
                          />
                        </>
                      )}
                    </WeekCalendarEvent>
                  ))
                }
              </WeekCalendarDay>
            ))}
          </div>
        </div>
      </div>
      <WeekCalendarInstructions>
        Up and Down move an event 15 minutes, Shift with Up and Down changes its length, Left and Right move
        it to another day, Enter renames it and Delete removes it. Control or Command with Z undoes.
      </WeekCalendarInstructions>
    </WeekCalendar>
  )
}

export {
  type CalendarEvent,
  Example,
  formatTime,
  weekCalendar,
  WeekCalendar,
  type WeekCalendarActionState,
  WeekCalendarDay,
  type WeekCalendarDayState,
  WeekCalendarEvent,
  WeekCalendarEventEdge,
  WeekCalendarEventInput,
  type WeekCalendarEventsChangeReason,
  type WeekCalendarEventState,
  WeekCalendarInstructions,
  type WeekCalendarOptions,
  WeekCalendarRedo,
  type WeekCalendarRootState,
  WeekCalendarUndo,
}
