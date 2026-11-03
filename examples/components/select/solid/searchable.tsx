import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { For } from "solid-js"

const countries = [
  { value: "ar", label: "Argentina", code: "+54" },
  { value: "au", label: "Australia", code: "+61" },
  { value: "at", label: "Austria", code: "+43" },
  { value: "be", label: "Belgium", code: "+32" },
  { value: "br", label: "Brazil", code: "+55" },
  { value: "ca", label: "Canada", code: "+1" },
  { value: "cl", label: "Chile", code: "+56" },
  { value: "cn", label: "China", code: "+86" },
  { value: "dk", label: "Denmark", code: "+45" },
  { value: "fi", label: "Finland", code: "+358" },
  { value: "fr", label: "France", code: "+33" },
  { value: "de", label: "Germany", code: "+49" },
  { value: "gr", label: "Greece", code: "+30" },
  { value: "in", label: "India", code: "+91" },
  { value: "ie", label: "Ireland", code: "+353" },
  { value: "it", label: "Italy", code: "+39" },
  { value: "jp", label: "Japan", code: "+81" },
  { value: "mx", label: "Mexico", code: "+52" },
  { value: "nl", label: "Netherlands", code: "+31" },
  { value: "no", label: "Norway", code: "+47" },
  { value: "pt", label: "Portugal", code: "+351" },
  { value: "es", label: "Spain", code: "+34" },
  { value: "se", label: "Sweden", code: "+46" },
  { value: "ch", label: "Switzerland", code: "+41" },
]

const popularCountries = [
  { type: "group" as const, label: "Popular", items: [countries[5], countries[11], countries[16]] },
]

export function Example() {
  return (
    <Select
      items={countries}
      emptyItems={popularCountries}
      placeholder="Select a country"
      filter="contains"
      announcement={(change) =>
        change.type === "results"
          ? `${change.count} ${change.count === 1 ? "country" : "countries"} found`
          : null
      }
    >
      <div data-slot="stack">
        <SelectLabel>Country</SelectLabel>
        <SelectTrigger>
          <SelectValue />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </SelectTrigger>
      </div>
      <SelectContent>
        <div data-slot="row">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <SelectInput aria-label="Search countries" placeholder="Search countries…" />
        </div>
        <SelectEmpty>No countries found.</SelectEmpty>
        <SelectList>
          {(state) => (
            <For each={state.items as ((typeof countries)[number] | (typeof popularCountries)[number])[]}>
              {(entry) =>
                "items" in entry ? (
                  <SelectGroup>
                    <SelectGroupLabel>{entry.label}</SelectGroupLabel>
                    <For each={entry.items}>{(country) => <CountryItem country={country} />}</For>
                  </SelectGroup>
                ) : (
                  <CountryItem country={entry} />
                )
              }
            </For>
          )}
        </SelectList>
      </SelectContent>
    </Select>
  )
}

function CountryItem(props: { country: { value: string; label: string } }) {
  return (
    <SelectItem value={props.country.value} label={props.country.label}>
      <SelectItemText />
      <SelectItemIndicator>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </SelectItemIndicator>
    </SelectItem>
  )
}
