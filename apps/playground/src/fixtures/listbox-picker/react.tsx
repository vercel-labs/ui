import { bindScrollPicker } from "@ui-sdk/core"
import { Listbox, ListboxItem } from "@ui-sdk/react/listbox"
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  pickerFixtures,
  type PickerFixture,
} from "tests/fixtures/listbox-picker.ts"

function Picker({ picker }: { picker: PickerFixture }) {
  const [value, setValue] = React.useState<string | null>(picker.defaultValue)
  const [changes, setChanges] = React.useState<string[]>([])
  const choose = React.useCallback((next: string | null) => {
    setValue(next)
    setChanges((current) => [...current, String(next)])
  }, [])
  const bind = React.useCallback(
    (el: HTMLDivElement) =>
      bindScrollPicker(el, {
        onSelect: (index) => choose(picker.items[index].value),
      }),
    [choose, picker]
  )
  return (
    <>
      <Listbox
        ref={bind}
        className="picker"
        aria-label={picker.label}
        orientation={picker.orientation}
        keepInView={false}
        value={value}
        onValueChange={choose}
      >
        {picker.items.map((item) => (
          <ListboxItem
            key={item.value}
            className="picker-item"
            value={item.value}
            disabled={item.disabled}
          >
            {item.value}
          </ListboxItem>
        ))}
      </Listbox>
      <output role="status" aria-label={`${picker.label} changes`}>
        {changes.join(",")}
      </output>
    </>
  )
}

function Fixture() {
  return (
    <div className="fixture">
      <button>Before</button>
      {pickerFixtures.map((picker) => (
        <Picker key={picker.label} picker={picker} />
      ))}
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  createRoot(root).render(
    <React.StrictMode>
      <Fixture />
    </React.StrictMode>
  )
}

export { Fixture, mount }
