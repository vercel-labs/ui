// What every Date Picker fixture renders. Today is pinned, so specs read the
// same grid on any day. Change these here and nowhere else.
const datePickerFixture = {
  today: "2026-10-16",
  // The name the date submits under. A range submits its ends as `start` and `end`.
  name: "due",
  preset: { label: "Christmas", value: "2026-12-25" },
  rangePreset: { label: "Last 7 days", value: ["2026-10-10", "2026-10-16"] },
}

// What the "Last action" status says after a change.
const datePickerAction = (
  key: "value" | "open",
  value: unknown,
  reason: string
) => `${key}: ${JSON.stringify(value)} (${reason})`

// Options a spec can set through the URL: ?mode=range, ?value=<date>[,<date>]
// (the default value), ?min, ?max, ?unavailable=<date>,<date>, ?required,
// ?disabled, ?readonly, ?keepOpen (picking doesn't close it), ?minDays,
// ?maxDays, ?container=<id> (the popup renders there), and ?lang=<tag> (the
// date picker's surroundings are in that language).
function datePickerOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  const string = (name: string) => params.get(name) ?? undefined
  const mode = (string("mode") ?? "single") as "single" | "range"
  const container = params.get("container")
  const dates = params.get("value")?.split(",").filter(Boolean) ?? []
  const value =
    mode === "single"
      ? (dates[0] ?? null)
      : dates.length === 2
        ? (dates as [string, string])
        : null
  return {
    mode,
    defaultValue: value,
    min: string("min"),
    max: string("max"),
    unavailable: params.get("unavailable")?.split(","),
    required: params.has("required") || undefined,
    disabled: params.has("disabled") || undefined,
    readOnly: params.has("readonly") || undefined,
    closeOnSelect: params.has("keepOpen") ? false : undefined,
    minDays: number("minDays"),
    maxDays: number("maxDays"),
    lang: string("lang"),
    ...(container && { container: document.getElementById(container) }),
  }
}

// The Date Picker inside a Field: the field's label names its input and its
// description describes it, beside the format hint. Options through the URL:
// ?required, and ?disabled (on the field, not the date picker).
const datePickerFieldFixture = {
  label: "Due date",
  description: "When the invoice is due.",
}

function datePickerFieldOptions() {
  const params = new URLSearchParams(location.search)
  return {
    required: params.has("required") || undefined,
    disabled: params.has("disabled") || undefined,
  }
}

export {
  datePickerAction,
  datePickerFieldFixture,
  datePickerFieldOptions,
  datePickerFixture,
  datePickerOptions,
}
