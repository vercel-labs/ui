// The number inputs every implementation renders. Labels, names, values and
// order are the contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Order">
//   Field "Quantity" (named quantity): buttons "Decrease quantity" and "Increase quantity"
//   around the input (quantity, 1 at first, 1 to 99), and a description
//   Field "Amount": a scrub area, the input (amount, $1,234.50 at first, cents,
//   not below 0) and buttons "Decrease amount" and "Increase amount"
//   Save (submit), Reset
// </form>
// After
// Status "Last action", status "Committed", status "Submitted"
const numberInputFixture = {
  formLabel: "Order",
  quantity: {
    label: "Quantity",
    name: "quantity",
    defaultValue: 1,
    min: 1,
    max: 99,
    description: "Up to 99.",
    decrement: "Decrease quantity",
    increment: "Increase quantity",
  },
  amount: {
    label: "Amount",
    name: "amount",
    defaultValue: 1234.5,
    min: 0,
    step: 0.01,
    currency: "USD",
    scrub: "Drag to adjust",
    decrement: "Decrease amount",
    increment: "Increase amount",
  },
}

// Options a spec can set through the URL:
// ?quantity=<n> sets where the quantity starts, empty for none, ?required
// requires the quantity, ?wheel lets the wheel step both, ?disabled and
// ?readonly apply to both, ?disabled-increment disables only the quantity's
// increment button, ?locale=<tag> sets the locale, ?negative lets the amount go
// below 0, ?cancel=<name> cancels changes to that field, ?controlled controls
// the quantity.
function numberInputOptions() {
  const params = new URLSearchParams(location.search)
  const quantity = params.get("quantity")
  return {
    quantity:
      quantity === null
        ? numberInputFixture.quantity.defaultValue
        : quantity === ""
          ? null
          : Number(quantity),
    required: params.has("required"),
    wheel: params.has("wheel"),
    disabled: params.has("disabled"),
    readOnly: params.has("readonly"),
    disabledIncrement: params.has("disabled-increment"),
    locale: params.get("locale") ?? "en-US",
    amountMin: params.has("negative") ? undefined : numberInputFixture.amount.min,
    cancel: params.get("cancel"),
    controlled: params.has("controlled"),
  }
}

export { serialize } from "./slider.ts"

export { numberInputFixture, numberInputOptions }
