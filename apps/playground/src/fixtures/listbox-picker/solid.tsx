import { bindScrollPicker } from "@ui-sdk/core"
import { Listbox, ListboxItem } from "@ui-sdk/solid/listbox"
import { render } from "@solidjs/web"
import { createSignal, For, onSettled } from "solid-js"
import {
  pickerFixtures,
  type PickerFixture,
} from "tests/fixtures/listbox-picker.ts"

function Picker(props: { picker: PickerFixture }) {
  const [value, setValue] = createSignal<string | null>(
    props.picker.defaultValue
  )
  const [changes, setChanges] = createSignal<string[]>([])
  let list: HTMLDivElement | undefined
  const choose = (next: string | null) => {
    setValue(next)
    setChanges((current) => [...current, String(next)])
  }
  onSettled(() =>
    bindScrollPicker(list!, {
      onSelect: (index) => choose(props.picker.items[index].value),
    })
  )
  return (
    <>
      <Listbox
        ref={list}
        class="picker"
        aria-label={props.picker.label}
        orientation={props.picker.orientation}
        keepInView={false}
        value={value()}
        onValueChange={choose}
      >
        <For each={props.picker.items}>
          {(item) => (
            <ListboxItem
              class="picker-item"
              value={item.value}
              disabled={item.disabled}
            >
              {item.value}
            </ListboxItem>
          )}
        </For>
      </Listbox>
      <output role="status" aria-label={`${props.picker.label} changes`}>
        {changes().join(",")}
      </output>
    </>
  )
}

function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <For each={pickerFixtures}>{(picker) => <Picker picker={picker} />}</For>
      <button>After</button>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
