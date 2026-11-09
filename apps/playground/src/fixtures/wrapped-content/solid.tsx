import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteLabel,
} from "@ui-sdk/solid/autocomplete"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxLabel,
} from "@ui-sdk/solid/combobox"
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuList,
} from "@ui-sdk/solid/trigger-menu"
import { render } from "@solidjs/web"
import { wrappedContentFixture as f } from "tests/fixtures/wrapped-content.ts"

// Data roots whose content sits inside a fragment or a wrapping element. Each
// renders that content, and no second list of its own.
function Fixture() {
  return (
    <div class="fixture">
      <button>Before</button>
      <Select items={f.items}>
        <SelectLabel>{f.select}</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <>
          <SelectContent class="popup" />
        </>
      </Select>
      <Combobox items={f.items}>
        <ComboboxLabel>{f.combobox}</ComboboxLabel>
        <ComboboxInput />
        <div>
          <ComboboxContent class="popup" />
        </div>
      </Combobox>
      <Autocomplete items={f.items}>
        <AutocompleteLabel>{f.autocomplete}</AutocompleteLabel>
        <AutocompleteInput />
        <div>
          <AutocompleteContent class="popup" />
        </div>
      </Autocomplete>
      <TriggerMenu triggers={[{ char: "@", items: f.items }]}>
        <TriggerMenuInput aria-label={f.triggerMenu} />
        <>
          <TriggerMenuContent class="popup">
            <TriggerMenuList />
          </TriggerMenuContent>
        </>
      </TriggerMenu>
    </div>
  )
}

function mount(root: HTMLElement) {
  render(() => <Fixture />, root)
}

export { Fixture, mount }
