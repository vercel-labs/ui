import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/solid/combobox"
import { For, Show } from "solid-js"

const users = [
  { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
  { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
  { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
  { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
  { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
]

export function Example() {
  return (
    <Combobox>
      <div data-slot="stack">
        <ComboboxLabel>Mention</ComboboxLabel>
        <ComboboxInput
          placeholder="@username"
          render={(props) => (
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
              <input {...props} />
            </div>
          )}
        />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No one by that name.</ComboboxEmpty>
        <ComboboxList>
          <For each={users}>
            {(user) => (
              <ComboboxItem value={user.username} label={user.name} keywords={[user.username]}>
                {(state) => (
                  <>
                    <span data-slot="badge">{user.name.slice(0, 1)}</span>
                    <span data-slot="stack">
                      {user.name}
                      <span data-slot="hint">@{user.username}</span>
                    </span>
                    <Show when={state.selected}>
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
                    </Show>
                  </>
                )}
              </ComboboxItem>
            )}
          </For>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
