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
} from "@ui-sdk/solid/combobox"
import { createSignal, For } from "solid-js"

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
  const [submitted, setSubmitted] = createSignal("")

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
              </ComboboxTrigger>
            </div>
          </div>
          <ComboboxContent>
            <ComboboxEmpty>No countries found.</ComboboxEmpty>
            <ComboboxList>
              <For each={countries}>
                {(country) => (
                  <ComboboxItem value={country.value} label={country.label}>
                    {country.label}
                    <ComboboxItemIndicator>
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
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                )}
              </For>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <Combobox name="interests" multiple defaultValue={["Design"]}>
          <div data-slot="stack">
            <ComboboxLabel>Interests</ComboboxLabel>
            <ComboboxChips>
              <ComboboxValue>
                {(state) => (
                  <For each={state.value as string[]}>
                    {(label) => (
                      <ComboboxChip value={label}>
                        {label}
                        <ComboboxChipRemove aria-label={`Remove ${label}`}>
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </ComboboxChipRemove>
                      </ComboboxChip>
                    )}
                  </For>
                )}
              </ComboboxValue>
              <ComboboxInput placeholder="Add interests" />
            </ComboboxChips>
          </div>
          <ComboboxContent>
            <ComboboxList>
              <For each={labels}>
                {(label) => (
                  <ComboboxItem value={label}>
                    {label}
                    <ComboboxItemIndicator>
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
                    </ComboboxItemIndicator>
                  </ComboboxItem>
                )}
              </For>
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
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxContent>
          <ComboboxList>
            <For each={["London", "Paris", "Berlin", "Madrid"]}>
              {(city) => (
                <ComboboxItem value={city}>
                  {city}
                  <ComboboxItemIndicator>
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
                  </ComboboxItemIndicator>
                </ComboboxItem>
              )}
            </For>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <output data-slot="output">{submitted() || "Submit the form"}</output>
    </div>
  )
}

export { Example }
