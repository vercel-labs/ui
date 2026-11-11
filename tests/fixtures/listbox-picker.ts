// Two listboxes that pick by scrolling, each followed by a status naming
// every value it took. Labels, values and order are the contract the specs
// rely on, so change them here and nowhere else.
type PickerFixture = {
  label: string
  orientation: "horizontal" | "vertical"
  defaultValue: string
  items: { value: string; disabled?: boolean }[]
}

const numbers = (count: number, disabled?: string) =>
  Array.from({ length: count }, (_, index) => {
    const value = String(index + 1)
    return value === disabled ? { value, disabled: true } : { value }
  })

const pickerFixtures: PickerFixture[] = [
  {
    label: "Hour",
    orientation: "vertical",
    defaultValue: "3",
    items: numbers(12, "6"),
  },
  {
    label: "Page",
    orientation: "horizontal",
    defaultValue: "1",
    items: numbers(20),
  },
]

export { pickerFixtures, type PickerFixture }
