import * as React from "react"
import {
  createChange,
  createSpans,
  definePrimitive,
  isSpanFree,
  spansMessage,
  type Span,
  type SpansDraft,
} from "@ui-sdk/core"
import { createParts } from "@ui-sdk/react/primitive"

type Booking = Span & { title: string }

type RoomState = { bookings: Booking[]; draft: SpansDraft<Booking> | null; note: string }

const hour = (minutes: number) => `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, "0")}`

let lunches = 0

const room = definePrimitive({
  name: "room",
  state: (): RoomState => ({
    bookings: [
      { id: "standup", track: "Atlas", start: 9 * 60 + 30, end: 10 * 60 + 30, title: "Standup" },
      { id: "board", track: "Atlas", start: 14 * 60, end: 16 * 60, title: "Board meeting" },
    ],
    draft: null,
    note: "",
  }),
  api: (context) => {
    const { store } = context
    const change = createChange(context)
    const spans = createSpans<RoomState, Booking>(context, {
      key: "bookings",
      draft: "draft",
      set: (value, details) => change("bookings", value, details),
      axis: "x",
      min: () => 9 * 60,
      max: () => 17 * 60,
      step: () => 30,
      overlap: false,
      disabled: (booking) => booking.id === "board",
      label: (booking) => `${booking.title}, ${hour(booking.start)} to ${hour(booking.end)}`,
      message: (message) =>
        message.type === "delete" ? `${message.span.title} is cancelled.` : spansMessage(message),
      createAutoScroll: false,
    })
    const standup = () => store.get().bookings.find((booking) => booking.id === "standup")
    return {
      spans,
      act(action: string) {
        const booking = standup()
        if (action === "later" && booking)
          spans.update("standup", { start: booking.start + 30, end: booking.end + 30 })
        else if (action === "longer" && booking) spans.update("standup", { end: booking.end + 30 })
        else if (action === "delete") spans.remove("standup")
        else if (action === "noon") {
          const noon: Booking = {
            id: `lunch-${++lunches}`,
            track: "Atlas",
            start: 12 * 60,
            end: 13 * 60,
            title: "Lunch",
          }
          const free = isSpanFree(store.get().bookings, noon)
          store.set({ note: free ? "Booked noon." : "Noon is taken." })
          if (free) change("bookings", [...store.get().bookings, noon], { reason: "imperative" })
        }
      },
    }
  },
  slots: (slot) => ({
    root: slot<{}, { bookings: Booking[]; note: string }>({
      state: (state, { api }) => ({ bookings: api.spans.spans(state), note: state.note }),
    }),
    track: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ role: "group", style: "position:relative;touch-action:none;user-select:none" }),
      bind: (el, { api, key }) => {
        const unbind = api.spans.bindTrack(el, key)
        const view = el.ownerDocument.defaultView!
        view.addEventListener("blur", api.spans.cancel)
        return () => {
          unbind()
          view.removeEventListener("blur", api.spans.cancel)
        }
      },
    }),
    booking: slot<{ value: string }>({
      props: { value: "string" },
      attrs: (state, { api, key }) => {
        const booking = api.spans.spans(state).find((other) => other.id === key)
        return {
          tabindex: "0",
          "aria-disabled": key === "board" ? "true" : undefined,
          ...api.spans.spanAttrs(state, key),
          style: booking ? api.spans.spanStyle(booking) : undefined,
        }
      },
      on: {
        pointerdown: (event, { api, key }) => api.spans.spanPointerdown(event, key),
        keydown: (event, { api, key }) => api.spans.keydown(event, key),
      },
      bind: (el, { api, key }) => api.spans.bindSpan(el, key),
    }),
    action: slot<{ value: string }>({
      props: { value: "string" },
      attrs: () => ({ type: "button" }),
      press: ({ api, key }) => api.act(key),
    }),
  }),
})

const parts = createParts(room, { root: "div", track: "div", booking: "div", action: "button" })

const Room = parts.Root

const RoomTrack = parts.Track

const RoomBooking = parts.Booking

const RoomAction = parts.Action

function Example() {
  return (
    <Room>
      {({ bookings, note }) => (
        <>
          <RoomTrack value="Atlas" aria-label="Atlas">
            {bookings.map((booking) => (
              <RoomBooking key={booking.id} value={booking.id}>
                {booking.title} {hour(booking.start)}
              </RoomBooking>
            ))}
          </RoomTrack>
          <div data-slot="row">
            {[
              ["later", "Later"],
              ["longer", "Longer"],
              ["delete", "Delete"],
              ["noon", "Book noon"],
            ].map(([value, text]) => (
              <RoomAction data-size="sm" key={value} value={value}>
                {text}
              </RoomAction>
            ))}
            <p data-slot="hint">{note}</p>
          </div>
          <p data-slot="output">
            {bookings
              .map((booking) => `${booking.title} ${hour(booking.start)}–${hour(booking.end)}`)
              .join(" · ")}
          </p>
        </>
      )}
    </Room>
  )
}

export { type Booking, Example, room, Room, RoomAction, RoomBooking, type RoomState, RoomTrack }
