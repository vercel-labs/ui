// What every Calendar fixture renders. Dates are fixed, with today pinned, so
// specs read the same grid on any day. Change them here and nowhere else.
const calendarFixture = {
  today: "2026-10-16",
  previous: "Previous month",
  next: "Next month",
  // A button outside the calendar that focuses a date through the controller.
  controller: { label: "Show January 5, 2027", date: "2027-01-05" },
}

// What the "Last action" status says after a change.
const calendarAction = (
  key: "value" | "month",
  value: unknown,
  reason: string
) => `${key}: ${JSON.stringify(value)} (${reason})`

// Options a spec can set through the URL: ?mode=multiple|range,
// ?value=<date>[,<date>] (the default value), ?month=<YYYY-MM>, ?min, ?max,
// ?months=<n>, ?page (Previous, Next and keys turn every month shown),
// ?unavailable=weekends|<date>,<date>, ?weekStart=<0-6>, ?fixed,
// ?hideOutside, ?minDays, ?maxDays, ?allowUnavailable, ?disabled,
// ?readonly, ?controlled (the fixture owns the value and the month), and
// ?lang=<tag> (the calendar's surroundings are in that language), and
// ?selects (month and year selects in the header).
function calendarOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  const string = (name: string) => params.get(name) ?? undefined
  const mode = (string("mode") ?? "single") as "single" | "multiple" | "range"
  const dates = params.get("value")?.split(",").filter(Boolean) ?? []
  const value =
    mode === "single"
      ? (dates[0] ?? null)
      : mode === "range"
        ? dates.length === 2
          ? dates
          : null
        : dates
  const unavailable = params.get("unavailable")
  return {
    mode,
    defaultValue: value as string | string[] | null,
    defaultMonth: string("month"),
    min: string("min"),
    max: string("max"),
    months: number("months"),
    pageBy: params.has("page") ? ("page" as const) : undefined,
    unavailable:
      unavailable === "weekends"
        ? { weekday: [0, 6] }
        : unavailable
          ? unavailable.split(",")
          : undefined,
    weekStartsOn: number("weekStart"),
    fixedWeeks: params.has("fixed") || undefined,
    showOutsideDays: params.has("hideOutside") ? false : undefined,
    minDays: number("minDays"),
    maxDays: number("maxDays"),
    allowUnavailable: params.has("allowUnavailable") || undefined,
    disabled: params.has("disabled") || undefined,
    readOnly: params.has("readonly") || undefined,
    controlled: params.has("controlled"),
    selects: params.has("selects"),
    lang: string("lang"),
  }
}

export { calendarAction, calendarFixture, calendarOptions }
