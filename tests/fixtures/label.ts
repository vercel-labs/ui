// What every Label fixture renders. Labels, ids and order are the contract the
// specs rely on, so change them here and nowhere else.
const labelFixture = {
  // A native input, which a native label already names.
  email: { id: "email", label: "Email" },
  // A radio group, which a native label can't reach.
  plan: {
    id: "plan",
    label: "Plan",
    defaultValue: "pro",
    items: [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro" },
    ],
  },
  // A slider with one thumb, whose thumb is the control.
  volume: { id: "volume", label: "Volume", defaultValue: 40 },
  // A checkbox inside its label.
  terms: { label: "Accept terms" },
  // A disabled group, which a press on its label leaves alone.
  region: {
    id: "region",
    label: "Region",
    items: [
      { value: "east", label: "East" },
      { value: "west", label: "West" },
    ],
  },
  // A group its author names, which keeps that name.
  delivery: {
    id: "delivery",
    label: "Delivery",
    name: "Delivery speed",
    items: [
      { value: "standard", label: "Standard" },
      { value: "express", label: "Express" },
    ],
  },
  // A number input that renders after its label, once "Show quantity" is pressed.
  quantity: {
    id: "quantity",
    label: "Quantity",
    show: "Show quantity",
    defaultValue: 1,
  },
}

export { labelFixture }
