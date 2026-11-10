// What every Chronology fixture renders, in this order. Labels, values and
// order are the contract the specs rely on, so change them here and nowhere else.
const chronologyFixture = {
  label: "Order history",
  events: [
    {
      value: "placed",
      title: "Order placed",
      dateTime: "2026-11-01",
      time: "Nov 1",
      description: "We received your order.",
      status: "complete",
    },
    {
      value: "packed",
      title: "Packed",
      dateTime: "2026-11-02",
      time: "Nov 2",
      description: "Your items left the shelf.",
      status: "complete",
    },
    {
      value: "shipped",
      title: "Shipped",
      dateTime: "2026-11-03",
      time: "Nov 3",
      description: "On its way with the carrier.",
      status: "current",
      // A link inside the event, which stays in the tab order.
      link: { label: "Track package", href: "#track" },
    },
    {
      value: "delivered",
      title: "Delivered",
      dateTime: "2026-11-05",
      time: "Nov 5",
      description: "Expected by Thursday.",
      status: "upcoming",
    },
  ],
  // The event the Add Event button puts first.
  added: {
    value: "confirmed",
    title: "Payment confirmed",
    dateTime: "2026-10-31",
    time: "Oct 31",
    description: "Your card was charged.",
    status: "complete",
  },
} as const

type ChronologyFixtureEvent = {
  value: string
  title: string
  dateTime: string
  time: string
  description: string
  status: "complete" | "current" | "upcoming"
  link?: { label: string; href: string }
}

// The events with the current step moved to the next one, for the Advance button.
function advance<Event extends { status: ChronologyFixtureEvent["status"] }>(
  events: readonly Event[]
) {
  const next = events.findIndex((event) => event.status === "current") + 1
  return events.map((event, index) => ({
    ...event,
    status: index < next ? "complete" : index === next ? "current" : "upcoming",
  }))
}

// Chronology options a spec can set through the URL:
// ?orientation=horizontal&loop=false&feed&busy.
function chronologyOptions() {
  const params = new URLSearchParams(location.search)
  const orientation = params.get("orientation")
  return {
    ...(orientation && {
      orientation: orientation as "horizontal" | "vertical",
    }),
    ...(params.get("loop") === "false" && { loop: false }),
    ...(params.has("feed") && { feed: true }),
    ...(params.has("busy") && { busy: true }),
  }
}

export {
  advance,
  chronologyFixture,
  chronologyOptions,
  type ChronologyFixtureEvent,
}
