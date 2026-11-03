"use client"

import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@ui-sdk/react/combobox"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import * as React from "react"

const countries = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "jp", label: "Japan" },
  { value: "nl", label: "Netherlands" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
]

const countryLabel = (value: string) => countries.find((country) => country.value === value)?.label ?? value

const labels = ["Bug", "Feature", "Documentation", "Design", "Performance", "Security", "Testing"]

function Example() {
  const [submitted, setSubmitted] = React.useState("")

  return (
    <div data-slot="stack">
      <form
        id="combobox-profile"
        data-slot="stack"
        onSubmit={(event) => {
          event.preventDefault()
          const data = [...new FormData(event.currentTarget)].map(([name, value]) => `${name}=${value}`)
          setSubmitted(data.join("&"))
        }}
        onReset={() => setSubmitted("")}
      >
        <Combobox name="country" required itemToLabel={countryLabel}>
          <div data-slot="stack">
            <ComboboxLabel>Country</ComboboxLabel>
            <div data-slot="row">
              <ComboboxInput placeholder="Search countries" />
              <ComboboxTrigger aria-label="Show countries">
                <ChevronDownIcon aria-hidden="true" />
              </ComboboxTrigger>
            </div>
          </div>
          <ComboboxContent>
            <ComboboxEmpty>No countries found.</ComboboxEmpty>
            <ComboboxList>
              {countries.map((country) => (
                <ComboboxItem key={country.value} value={country.value} label={country.label}>
                  {country.label}
                  <ComboboxItemIndicator>
                    <CheckIcon aria-hidden="true" />
                  </ComboboxItemIndicator>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox name="interests" multiple defaultValue={["Design"]}>
          <div data-slot="stack">
            <ComboboxLabel>Interests</ComboboxLabel>
            <ComboboxChips>
              <ComboboxValue>
                {(state) =>
                  (state.value as string[]).map((label) => (
                    <ComboboxChip key={label} value={label}>
                      {label}
                      <ComboboxChipRemove aria-label={`Remove ${label}`}>
                        <XIcon aria-hidden="true" />
                      </ComboboxChipRemove>
                    </ComboboxChip>
                  ))
                }
              </ComboboxValue>
              <ComboboxInput placeholder="Add interests" />
            </ComboboxChips>
          </div>
          <ComboboxContent>
            <ComboboxList>
              {labels.map((label) => (
                <ComboboxItem key={label} value={label}>
                  {label}
                  <ComboboxItemIndicator>
                    <CheckIcon aria-hidden="true" />
                  </ComboboxItemIndicator>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <div data-slot="row">
          <button type="submit" data-variant="solid">
            Submit
          </button>
          <button type="reset">Reset</button>
        </div>
      </form>
      <Combobox name="timezone" form="combobox-profile" defaultValue="Paris">
        <div data-slot="stack">
          <ComboboxLabel>City</ComboboxLabel>
          <div data-slot="row">
            <ComboboxInput />
            <ComboboxTrigger aria-label="Show cities">
              <ChevronDownIcon aria-hidden="true" />
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxContent>
          <ComboboxList>
            {["London", "Paris", "Berlin", "Madrid"].map((city) => (
              <ComboboxItem key={city} value={city}>
                {city}
                <ComboboxItemIndicator>
                  <CheckIcon aria-hidden="true" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <output data-slot="output">{submitted || "Submit the form"}</output>
    </div>
  )
}

export { Example }
