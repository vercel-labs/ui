import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/solid/checkbox"
import { createSignal, For } from "solid-js"

const people = [
  { id: "sarah", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },
  { id: "marcus", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },
  { id: "priya", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },
  { id: "david", name: "David Kim", email: "david.kim@example.com", role: "Editor" },
]

function Example() {
  const [selected, setSelected] = createSignal(["sarah"])

  return (
    <div data-slot="stack">
      <CheckboxGroup
        aria-label="Team members"
        value={selected()}
        onValueChange={setSelected}
        allValues={people.map((person) => person.id)}
      >
        <table>
          <thead>
            <tr>
              <th>
                <Checkbox aria-label="Select all" parent>
                  <CheckboxIndicator>
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
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </CheckboxIndicator>
                </Checkbox>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <For each={people}>
              {(person) => (
                <tr>
                  <td>
                    <Checkbox value={person.id} aria-label={`Select ${person.name}`}>
                      <CheckboxIndicator>
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
                      </CheckboxIndicator>
                    </Checkbox>
                  </td>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td>{person.role}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </CheckboxGroup>
      <output data-slot="output">
        {selected().length} of {people.length} selected
      </output>
    </div>
  )
}

export { Example }
