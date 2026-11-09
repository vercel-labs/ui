import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteLabel,
} from "@ui-sdk/vue/autocomplete"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxLabel,
} from "@ui-sdk/vue/combobox"
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/vue/select"
import {
  TriggerMenu,
  TriggerMenuContent,
  TriggerMenuInput,
  TriggerMenuList,
} from "@ui-sdk/vue/trigger-menu"
import { createApp, defineComponent, Fragment, h } from "vue"
import { wrappedContentFixture as f } from "tests/fixtures/wrapped-content.ts"

// Data roots whose content sits inside a fragment or a wrapping element. Each
// renders that content, and no second list of its own.
const Fixture = defineComponent(
  () => () =>
    h("div", { class: "fixture" }, [
      h("button", "Before"),
      h(Select, { items: f.items }, () => [
        h(SelectLabel, () => f.select),
        h(SelectTrigger, () => h(SelectValue)),
        h(Fragment, [h(SelectContent, { class: "popup" })]),
      ]),
      h(Combobox, { items: f.items }, () => [
        h(ComboboxLabel, () => f.combobox),
        h(ComboboxInput),
        h("div", [h(ComboboxContent, { class: "popup" })]),
      ]),
      h(Autocomplete, { items: f.items }, () => [
        h(AutocompleteLabel, () => f.autocomplete),
        h(AutocompleteInput),
        h("div", [h(AutocompleteContent, { class: "popup" })]),
      ]),
      h(TriggerMenu, { triggers: [{ char: "@", items: f.items }] }, () => [
        h(TriggerMenuInput, { "aria-label": f.triggerMenu }),
        h(Fragment, [
          h(TriggerMenuContent, { class: "popup" }, () => h(TriggerMenuList)),
        ]),
      ]),
    ])
)

function mount(root: HTMLElement) {
  createApp(Fixture).mount(root)
}

export { mount }
