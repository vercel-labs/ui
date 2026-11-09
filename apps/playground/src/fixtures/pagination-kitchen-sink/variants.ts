// Every scenario in the kitchen sink. Each framework renders the same list.
type Variant = {
  id: string
  section: "Range" | "Links" | "State" | "Parts"
  title: string
  note?: string
  // Options passed as they are.
  options?: Record<string, unknown>
  place?: "rtl"
  controlled?: boolean
  controller?: boolean
  // Cancels every change from the change callback.
  cancel?: boolean
  // Parts are links to #kitchen-<page>.
  links?: boolean
  // Steps shown: all four, or only Previous and Next with text.
  steps?: "all" | "text"
}

const variants: Variant[] = [
  {
    id: "default",
    section: "Range",
    title: "Default",
    options: { pageCount: 10 },
  },
  {
    id: "default-page",
    section: "Range",
    title: "defaultPage",
    options: { pageCount: 10, defaultPage: 5 },
  },
  {
    id: "one-page",
    section: "Range",
    title: "One page",
    options: { pageCount: 1 },
  },
  {
    id: "few-pages",
    section: "Range",
    title: "Few pages",
    options: { pageCount: 3 },
  },
  {
    id: "many-pages",
    section: "Range",
    title: "Many pages",
    options: { pageCount: 100, defaultPage: 50 },
  },
  {
    id: "siblings-0",
    section: "Range",
    title: "siblings 0",
    options: { pageCount: 20, siblings: 0, defaultPage: 10 },
  },
  {
    id: "siblings-2",
    section: "Range",
    title: "siblings 2",
    options: { pageCount: 20, siblings: 2, defaultPage: 10 },
  },
  {
    id: "boundaries-0",
    section: "Range",
    title: "boundaries 0",
    options: { pageCount: 20, boundaries: 0, defaultPage: 10 },
  },
  {
    id: "boundaries-2",
    section: "Range",
    title: "boundaries 2",
    options: { pageCount: 20, boundaries: 2, defaultPage: 10 },
  },
  {
    id: "total",
    section: "Range",
    title: "total and pageSize",
    note: "95 items, 20 to a page.",
    options: { total: 95, pageSize: 20 },
  },
  {
    id: "links",
    section: "Links",
    title: "getHref",
    links: true,
    options: { pageCount: 10 },
  },
  {
    id: "links-end",
    section: "Links",
    title: "getHref on the last page",
    links: true,
    options: { pageCount: 10, defaultPage: 10 },
  },
  {
    id: "controlled",
    section: "State",
    title: "Controlled",
    controlled: true,
    options: { pageCount: 10 },
  },
  {
    id: "controller",
    section: "State",
    title: "Controller",
    controller: true,
    options: { pageCount: 10 },
  },
  {
    id: "cancel",
    section: "State",
    title: "Canceled changes",
    cancel: true,
    options: { pageCount: 10 },
  },
  {
    id: "rtl",
    section: "Parts",
    title: "Right to left",
    place: "rtl",
    options: { pageCount: 10, defaultPage: 5 },
  },
  {
    id: "text-steps",
    section: "Parts",
    title: "Previous and Next with text",
    steps: "text",
    options: { pageCount: 10 },
  },
]

export { type Variant, variants }
