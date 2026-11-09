// What every Date Input fixture renders. Labels, values and order are the
// contract the specs rely on, so change them here and nowhere else.
const dateInputFixture = {
  // A date in a field, submitted as "start".
  date: { label: "Start date", name: "start" },
  // A time in a field, submitted as "time".
  time: { label: "Meeting time", name: "time" },
  form: { label: "Schedule", submit: "Save", reset: "Reset" },
  // "Set date" sets this through a controller, and "Clear date" empties it.
  filled: "2026-12-25",
}

// What the "Last action" status says.
const dateInputAction = {
  change: (which: "date" | "time", value: string | null, reason: string) =>
    `${which}: ${value ?? "empty"} (${reason})`,
}

// URL options: ?date, ?time, ?locale, ?granularity, ?hour-cycle, ?min and
// ?max set options of the same name, ?weekdays makes weekends unavailable, and
// ?cancel=<value> cancels a change to that value.
function dateInputOptions() {
  const params = new URLSearchParams(location.search)
  const hourCycle = params.get("hour-cycle")
  return {
    date: {
      defaultValue: params.get("date") ?? undefined,
      locale: params.get("locale") ?? "en-US",
      granularity: (params.get("granularity") ?? undefined) as
        "day" | "minute" | undefined,
      hourCycle: hourCycle ? (Number(hourCycle) as 12 | 24) : undefined,
      min: params.get("min") ?? undefined,
      max: params.get("max") ?? undefined,
      unavailable: params.has("weekdays") ? { weekday: [0, 6] } : undefined,
    },
    time: {
      defaultValue: params.get("time") ?? undefined,
      locale: params.get("locale") ?? "en-US",
      hourCycle: hourCycle ? (Number(hourCycle) as 12 | 24) : undefined,
    },
    disabled: params.has("disabled"),
    readOnly: params.has("readonly"),
    required: params.has("required"),
    cancel: params.get("cancel"),
  }
}

export { dateInputAction, dateInputFixture, dateInputOptions }
