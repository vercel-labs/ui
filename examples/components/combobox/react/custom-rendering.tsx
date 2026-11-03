import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@ui-sdk/react/combobox"
import { CheckIcon, SearchIcon } from "lucide-react"

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
              <SearchIcon />
              <input {...props} />
            </div>
          )}
        />
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No one by that name.</ComboboxEmpty>
        <ComboboxList>
          {users.map((user) => (
            <ComboboxItem key={user.id} value={user.username} label={user.name} keywords={[user.username]}>
              {(state) => (
                <>
                  <span data-slot="badge">{user.name.slice(0, 1)}</span>
                  <span data-slot="stack">
                    {user.name}
                    <span data-slot="hint">@{user.username}</span>
                  </span>
                  {state.selected && <CheckIcon />}
                </>
              )}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
