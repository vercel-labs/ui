import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@ui-sdk/solid/autocomplete"
import { createSignal, For } from "solid-js"

const recent = ["react hooks", "tailwind grid", "web components", "vue v-model"]

function Example() {
  const [searched, setSearched] = createSignal("")
  return (
    <form role="search" data-slot="stack" onSubmit={(event) => event.preventDefault()}>
      <Autocomplete submitOnSelect name="q" onSubmit={(value) => setSearched(value)}>
        <AutocompleteInput type="search" aria-label="Search" placeholder="Search…" />
        <AutocompleteContent>
          <AutocompleteList>
            <For each={recent}>
              {(search) => <AutocompleteItem value={search}>{search}</AutocompleteItem>}
            </For>
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <output data-slot="output">{searched() ? `Searched “${searched()}”` : "Press Enter to search"}</output>
    </form>
  )
}

export { Example }
