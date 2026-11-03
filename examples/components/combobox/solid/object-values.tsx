import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/solid/combobox"
import { createSignal, For } from "solid-js"

const users = [
  { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
  { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
  { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
  { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
  { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
]

function Example() {
  const [user, setUser] = createSignal<(typeof users)[number] | null>({ ...users[2] })

  return (
    <div data-slot="stack">
      <Combobox
        value={user()}
        onValueChange={setUser}
        name="reviewer"
        itemToValue={(item) => String(item.id)}
        itemToLabel={(item) => item.name}
        isItemEqualToValue={(item, value) => item.id === value.id}
      >
        <div data-slot="stack">
          <ComboboxLabel>Reviewer</ComboboxLabel>
          <div data-slot="row">
            <ComboboxInput placeholder="Search people" />
            <ComboboxTrigger aria-label="Show people">
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
          <ComboboxEmpty>No people found.</ComboboxEmpty>
          <ComboboxList>
            <For each={users}>
              {(item) => (
                <ComboboxItem value={item} label={item.name}>
                  {item.name}
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
      <output data-slot="output">Submits reviewer={user()?.id ?? ""}</output>
    </div>
  )
}

export { Example }
