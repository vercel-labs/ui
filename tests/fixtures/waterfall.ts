// The trace every waterfall implementation renders. Labels, values, times and
// order are the contract the specs rely on, so change them here and nowhere else.
type WaterfallFixtureItem = {
  value: string
  label: string
  start: number
  duration: number
  status: string
  children?: WaterfallFixtureItem[]
}

const waterfallFixture = {
  label: "Requests",
  items: [
    {
      value: "document",
      label: "GET /",
      start: 0,
      duration: 1000,
      status: "200",
      children: [
        {
          value: "styles",
          label: "GET /app.css",
          start: 120,
          duration: 340,
          status: "200",
        },
        {
          value: "script",
          label: "GET /app.js",
          start: 120,
          duration: 480,
          status: "200",
          children: [
            {
              value: "user",
              label: "GET /api/user",
              start: 600,
              duration: 300,
              status: "200",
            },
            {
              value: "flags",
              label: "GET /api/flags",
              start: 620,
              duration: 180,
              status: "404",
            },
          ],
        },
      ],
    },
    {
      value: "font",
      label: "GET /font.woff2",
      start: 1000,
      duration: 1000,
      status: "200",
    },
  ] satisfies WaterfallFixtureItem[] as WaterfallFixtureItem[],
  // A moment the axis marks.
  mark: { time: 820, label: "DOMContentLoaded" },
}

// Every span with the ones nested in it after it, in order.
function flatWaterfall(
  items: readonly WaterfallFixtureItem[]
): WaterfallFixtureItem[] {
  return items.flatMap((item) => [item, ...flatWaterfall(item.children ?? [])])
}

// What the fixture's status region shows after a change, like "expanded document,script".
function describeWaterfall(
  kind: string,
  value: string | readonly string[] | null
) {
  const shown =
    value === null
      ? "none"
      : typeof value === "string"
        ? value
        : value.length
          ? value.join(",")
          : "none"
  return `${kind} ${shown}`
}

// A long trace for the count gates and the virtualized fixture: `n` top-level
// requests, each with two spans inside.
function longTrace(n: number) {
  return Array.from({ length: n }, (_, index) => ({
    value: `request-${index + 1}`,
    label: `Request ${index + 1}`,
    start: index * 10,
    duration: 40,
    status: "200",
    children: [
      {
        value: `request-${index + 1}-dns`,
        label: `DNS ${index + 1}`,
        start: index * 10,
        duration: 5,
        status: "200",
      },
      {
        value: `request-${index + 1}-body`,
        label: `Body ${index + 1}`,
        start: index * 10 + 5,
        duration: 35,
        status: "200",
      },
    ],
  })) satisfies WaterfallFixtureItem[]
}

// Options a spec can set through the URL: ?expanded=a,b expands, ?default=<value>
// selects, ?cancel=<value> cancels expanding that span, ?range=500,1000 zooms.
function waterfallOptions() {
  const params = new URLSearchParams(location.search)
  const range = params.get("range")?.split(",").map(Number)
  return {
    defaultExpanded: params.get("expanded")?.split(",").filter(Boolean) ?? [],
    defaultValue: params.get("default"),
    range: range?.length === 2 ? (range as [number, number]) : undefined,
    cancel: params.get("cancel"),
  }
}

export {
  describeWaterfall,
  flatWaterfall,
  longTrace,
  waterfallFixture,
  type WaterfallFixtureItem,
  waterfallOptions,
}
