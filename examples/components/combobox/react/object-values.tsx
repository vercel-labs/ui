"use client"

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
} from "@ui-sdk/react/combobox"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import * as React from "react"

const users = [
  { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
  { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
  { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
  { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
  { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
]

function Example() {
  const [user, setUser] = React.useState<(typeof users)[number] | null>({ ...users[2] })

  return (
    <div data-slot="stack">
      <Combobox
        value={user}
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
              <ChevronDownIcon aria-hidden="true" />
            </ComboboxTrigger>
          </div>
        </div>
        <ComboboxContent>
          <ComboboxEmpty>No people found.</ComboboxEmpty>
          <ComboboxList>
            {users.map((item) => (
              <ComboboxItem key={item.id} value={item} label={item.name}>
                {item.name}
                <ComboboxItemIndicator>
                  <CheckIcon aria-hidden="true" />
                </ComboboxItemIndicator>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <output data-slot="output">Submits reviewer={user ? user.id : ""}</output>
    </div>
  )
}

export { Example }
