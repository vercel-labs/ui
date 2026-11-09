// The items every accordion implementation renders. Labels, values and order
// are the contract the specs rely on, so change them here and nowhere else.
type AccordionFixtureItem = {
  value: string
  label: string
  content: string
  disabled?: boolean
  // A labelled text field inside the panel, after its content.
  field?: string
  // A button inside the panel that closes its own item.
  close?: string
}

const accordionFixture = {
  defaultValue: ["shipping"],
  items: [
    {
      value: "shipping",
      label: "Shipping",
      content: "We ship worldwide within five business days.",
    },
    {
      value: "returns",
      label: "Returns",
      content: "Return any unused item within thirty days.",
      field: "Order number",
    },
    {
      value: "warranty",
      label: "Warranty",
      content: "Every product has a two year warranty.",
      disabled: true,
    },
    {
      value: "support",
      label: "Support",
      content: "Write to us any time.",
      close: "Done",
    },
  ] satisfies AccordionFixtureItem[] as AccordionFixtureItem[],
}

// What the fixture's status region shows after a change.
function describeValue(value: readonly unknown[]) {
  return value.length ? value.join(",") : "none"
}

export { accordionFixture, type AccordionFixtureItem, describeValue }
