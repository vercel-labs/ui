// The listbox every implementation renders. Labels, values and order are the
// contract the specs rely on, so change them here and nowhere else.
//
// Before
// <form "Order">
//   A listbox named "Toppings": Basil, Cheese, Garlic, Mushroom, Olive
//   (disabled), Onion, Pepper, Tomato, each with a check while selected and
//   an icon. With ?grouped: "Herbs" (Basil, Garlic) and "Vegetables"
//   (Mushroom, Onion, Pepper), split by a separator.
//   Submit, Reset
// </form>
// After
// Status "Last action": "value:<values, comma-separated>", for the last value change
// Status "Reason": the last change's reason
// Status "Submitted": what the form submitted, as a query string
// Clear with controller, Select all with controller
const listboxFixture = {
  label: "Toppings",
  name: "toppings",
  formLabel: "Order",
  items: [
    { value: "basil", label: "Basil" },
    { value: "cheese", label: "Cheese" },
    { value: "garlic", label: "Garlic" },
    { value: "mushroom", label: "Mushroom" },
    { value: "olive", label: "Olive", disabled: true },
    { value: "onion", label: "Onion" },
    { value: "pepper", label: "Pepper" },
    { value: "tomato", label: "Tomato" },
  ],
  groups: [
    {
      label: "Herbs",
      items: [
        { value: "basil", label: "Basil" },
        { value: "garlic", label: "Garlic" },
      ],
    },
    {
      label: "Vegetables",
      items: [
        { value: "mushroom", label: "Mushroom" },
        { value: "onion", label: "Onion" },
        { value: "pepper", label: "Pepper" },
      ],
    },
  ],
  clear: "Clear with controller",
  selectAll: "Select all with controller",
}

type ListboxFixtureItem = { value: string; label: string; disabled?: boolean }

// The items as data, grouped with ?grouped, for data fixtures.
function listboxData(grouped: boolean) {
  if (!grouped) {
    return listboxFixture.items
  }
  const [herbs, vegetables] = listboxFixture.groups
  return [
    { type: "group" as const, label: herbs.label, items: herbs.items },
    { type: "separator" as const },
    {
      type: "group" as const,
      label: vegetables.label,
      items: vegetables.items,
    },
  ]
}

// Options a spec can set through the URL:
// ?value=cheese selects Cheese at first (comma-separated with ?multiple),
// ?multiple, ?activation=manual|automatic, ?orientation=horizontal,
// ?loop=false, ?deselectable, ?grouped, ?required, ?readonly, ?disabled,
// ?cancel cancels value changes, ?fieldset puts the listbox in a disabled
// fieldset, ?long renders 300 items in a list that scrolls, and ?controlled
// keeps the value in the fixture's own state.
function listboxOptions() {
  const params = new URLSearchParams(location.search)
  const multiple = params.has("multiple")
  const value = params.get("value")
  const activation = params.get("activation")
  const activations = ["automatic", "manual"] as const
  return {
    multiple,
    ...(value !== null && {
      defaultValue: multiple ? value.split(",").filter(Boolean) : value,
    }),
    activation: activations.find((mode) => mode === activation),
    orientation:
      params.get("orientation") === "horizontal"
        ? ("horizontal" as const)
        : ("vertical" as const),
    loop: params.get("loop") !== "false",
    deselectable: params.has("deselectable"),
    grouped: params.has("grouped"),
    required: params.has("required"),
    readOnly: params.has("readonly"),
    disabled: params.has("disabled"),
    cancel: params.has("cancel"),
    fieldset: params.has("fieldset"),
    long: params.has("long"),
    controlled: params.has("controlled"),
  }
}

// What the "Last action" status shows for a value.
const listboxAction = (value: unknown) =>
  `value:${Array.isArray(value) ? value.join(",") : value === null ? "" : String(value)}`

// The items a spec swaps in with `changeItems`. "without-cheese" drops
// Cheese, and "reversed" lists the items backwards.
const changedToppings = {
  "without-cheese": listboxFixture.items.filter(
    (item) => item.value !== "cheese"
  ),
  reversed: [...listboxFixture.items].reverse(),
  // Every option leaves, so none can hold the tab stop.
  none: [],
}

// A long list that scrolls: Topping 1 to Topping 300.
function longToppings(count = 300) {
  return Array.from({ length: count }, (_, index) => ({
    value: `topping-${index + 1}`,
    label: `Topping ${index + 1}`,
  }))
}

export {
  changedToppings,
  listboxAction,
  listboxData,
  listboxFixture,
  type ListboxFixtureItem,
  listboxOptions,
  longToppings,
}
