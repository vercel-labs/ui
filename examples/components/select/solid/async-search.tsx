import { createAsyncOptions } from "@ui-sdk/core/async-options"
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectInput,
  SelectItem,
  SelectItemIndicator,
  SelectLabel,
  SelectList,
  SelectStatus,
  SelectTrigger,
  SelectValue,
} from "@ui-sdk/solid/select"
import { For, createSignal, onCleanup } from "solid-js"

const countryList = [
  { value: "ar", label: "Argentina" },
  { value: "au", label: "Australia" },
  { value: "at", label: "Austria" },
  { value: "be", label: "Belgium" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "cl", label: "Chile" },
  { value: "cn", label: "China" },
  { value: "dk", label: "Denmark" },
  { value: "fi", label: "Finland" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "gr", label: "Greece" },
  { value: "in", label: "India" },
  { value: "ie", label: "Ireland" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "mx", label: "Mexico" },
  { value: "nl", label: "Netherlands" },
  { value: "no", label: "Norway" },
  { value: "pt", label: "Portugal" },
  { value: "es", label: "Spain" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
]

function searchCountries(query: string, { signal, page }: { signal: AbortSignal; page: number }) {
  return new Promise<{ items: typeof countryList; hasMore: boolean }>((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = query.trim().toLowerCase()
      const found = countryList.filter((country) => country.label.toLowerCase().includes(needle))
      resolve({ items: found.slice(page * 6, page * 6 + 6), hasMore: found.length > page * 6 + 6 })
    }, 400)
    signal.addEventListener("abort", () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

function Example() {
  const [query, setQuery] = createSignal("")
  const results = createAsyncOptions(searchCountries, { immediate: true })
  const [loaded, setLoaded] = createSignal(results.getState())
  onCleanup(results.subscribe(() => setLoaded(results.getState())))
  onCleanup(() => results.cancel())

  return (
    <Select
      items={loaded().items}
      filter={false}
      status={loaded().status}
      query={query()}
      onQueryChange={(next) => {
        setQuery(next)
        results.setQuery(next)
      }}
      onLoadMore={results.loadMore}
      placeholder="Select a country"
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
        <SelectInput aria-label="Search countries" placeholder="Search countries…" />
        <SelectEmpty>
          {(state) => (state.empty && !state.loading ? `No countries match “${state.query}”.` : null)}
        </SelectEmpty>
        <SelectList>
          {(state) => (
            <For each={state.items as { value: string; label: string; disabled?: boolean }[]}>
              {(item) => (
                <SelectItem value={item.value} label={item.label} disabled={item.disabled}>
                  {item.label}
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
              )}
            </For>
          )}
        </SelectList>
        <SelectStatus>
          {(state) =>
            state.loading
              ? "Loading…"
              : state.status === "error"
                ? "Couldn't load countries."
                : `${state.count} shown`
          }
        </SelectStatus>
      </SelectContent>
    </Select>
  )
}

export { Example }
