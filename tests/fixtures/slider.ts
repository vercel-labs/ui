// The sliders every implementation renders. Labels, names, values and order
// are the contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Booking">
//   Field "Volume": a slider (volume, 50 at first) and its value, and a description
//   Field "Price": a range (price, 20 to 80) with thumbs "Minimum price" and
//   "Maximum price", and its value
//   Save (submit), Reset
// </form>
// After
// Status "Last action", status "Committed", status "Submitted"
const sliderFixture = {
  formLabel: "Booking",
  volume: {
    label: "Volume",
    name: "volume",
    defaultValue: 50,
    description: "How loud the room is.",
  },
  price: {
    label: "Price",
    name: "price",
    defaultValue: [20, 80],
    thumbs: ["Minimum price", "Maximum price"],
  },
}

// Options a spec can set through the URL:
// ?orientation=vertical lays both out vertically, ?disabled disables both,
// ?volume=<n> and ?price=<a,b> set where they start, ?min-steps=<n> keeps the
// price thumbs apart, ?large-step=<n> sets the large step, ?currency formats
// the price in euros, ?percent formats the volume as a percent, ?locale=<tag> sets the locale, ?cancel=<name> cancels
// changes to that slider, ?controlled controls the volume.
function sliderOptions() {
  const params = new URLSearchParams(location.search)
  const number = (name: string) =>
    params.has(name) ? Number(params.get(name)) : undefined
  const price = params.get("price")
  return {
    orientation: (params.get("orientation") ?? undefined) as
      "horizontal" | "vertical" | undefined,
    disabled: params.has("disabled"),
    volume: number("volume") ?? sliderFixture.volume.defaultValue,
    price: price
      ? price.split(",").map(Number)
      : sliderFixture.price.defaultValue,
    minSteps: number("min-steps"),
    largeStep: number("large-step"),
    format: params.has("currency")
      ? { style: "currency" as const, currency: "EUR" }
      : undefined,
    volumeFormat: params.has("percent")
      ? { style: "unit" as const, unit: "percent" }
      : undefined,
    locale: params.get("locale") ?? undefined,
    cancel: params.get("cancel"),
    controlled: params.has("controlled"),
  }
}

// What a form would submit, as a query string.
function serialize(form: HTMLFormElement) {
  return new URLSearchParams(
    new FormData(form) as unknown as Record<string, string>
  ).toString()
}

export { serialize, sliderFixture, sliderOptions }
