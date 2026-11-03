import {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
} from "@ui-sdk/solid/autocomplete"
import { createSignal, For } from "solid-js"

const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry"]

export function Example() {
  const [box, setBox] = createSignal<HTMLElement | null>(null)
  return (
    <div ref={setBox} data-slot="card">
      <Autocomplete modal="pointer" container={box()}>
        <AutocompleteLabel>Fruit</AutocompleteLabel>
        <AutocompleteInput />
        <AutocompleteContent
          side="top"
          align="end"
          sideOffset={10}
          alignOffset={-4}
          collisionPadding={8}
          anchor={box()}
          keepMounted
        >
          <AutocompleteArrow />
          <AutocompleteList>
            <For each={fruits}>{(fruit) => <AutocompleteItem value={fruit}>{fruit}</AutocompleteItem>}</For>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
