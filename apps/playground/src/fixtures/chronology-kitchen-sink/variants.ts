// Every scenario in the kitchen sink. Each framework renders the same list.
type Status = "complete" | "current" | "upcoming"

type Event = {
  value: string
  title: string
  dateTime: string
  time: string
  description: string
  status?: Status
  link?: string
}

type Variant = {
  id: string
  section: "Layout" | "Status" | "Feed" | "Content"
  title: string
  note?: string
  // Options passed as they are.
  options?: Record<string, unknown>
  place?: "rtl"
  events: Event[]
  controller?: boolean
  // Each event holds a collapsible with more about it.
  details?: boolean
}

const order: Event[] = [
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
    link: "Track package",
  },
  {
    value: "delivered",
    title: "Delivered",
    dateTime: "2026-11-05",
    time: "Nov 5",
    description: "Expected by Thursday.",
    status: "upcoming",
  },
]

const plain = order.map(({ status: _, link: __, ...event }) => event)

const variants: Variant[] = [
  { id: "default", section: "Layout", title: "Default", events: plain },
  {
    id: "horizontal",
    section: "Layout",
    title: "Horizontal",
    options: { orientation: "horizontal" },
    events: plain,
  },
  {
    id: "no-loop",
    section: "Layout",
    title: "loop false",
    options: { loop: false },
    events: plain,
  },
  {
    id: "rtl",
    section: "Layout",
    title: "Horizontal, right to left",
    place: "rtl",
    options: { orientation: "horizontal" },
    events: plain,
  },
  {
    id: "one-event",
    section: "Layout",
    title: "One event",
    events: plain.slice(0, 1),
  },
  {
    id: "status",
    section: "Status",
    title: "Status",
    note: "The current event takes the tab stop and says it's the current step.",
    events: order,
  },
  {
    id: "controller",
    section: "Status",
    title: "Controller",
    controller: true,
    events: order,
  },
  {
    id: "feed",
    section: "Feed",
    title: "Feed",
    note: "Page Down and Page Up move between articles.",
    options: { feed: true },
    events: order,
  },
  {
    id: "feed-busy",
    section: "Feed",
    title: "Busy feed",
    options: { feed: true, busy: true },
    events: order,
  },
  {
    id: "details",
    section: "Content",
    title: "Expandable details",
    details: true,
    events: order,
  },
]

export { type Event, type Variant, variants }
