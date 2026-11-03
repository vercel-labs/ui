<script lang="ts">
  import { CheckIcon, MinusIcon } from "@lucide/svelte"
  import { Checkbox, CheckboxGroup, CheckboxIndicator } from "@ui-sdk/svelte/checkbox"

  const people = [
    { id: "sarah", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },
    { id: "marcus", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },
    { id: "priya", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },
    { id: "david", name: "David Kim", email: "david.kim@example.com", role: "Editor" },
  ]
  let selected = $state(["sarah"])
</script>

<div data-slot="stack">
  <CheckboxGroup
    bind:value={selected}
    aria-label="Team members"
    allValues={people.map((person) => person.id)}
  >
    <table>
      <thead>
        <tr>
          <th>
            <Checkbox aria-label="Select all" parent>
              <CheckboxIndicator>
                <CheckIcon aria-hidden="true" />
                <MinusIcon aria-hidden="true" />
              </CheckboxIndicator>
            </Checkbox>
          </th>
          <th>Name</th>
          <th>
            Email
          </th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {#each people as person (person.id)}
          <tr>
            <td>
              <Checkbox value={person.id} aria-label={`Select ${person.name}`}>
                <CheckboxIndicator>
                  <CheckIcon aria-hidden="true" />
                </CheckboxIndicator>
              </Checkbox>
            </td>
            <td>{person.name}</td>
            <td>
              {person.email}
            </td>
            <td>{person.role}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </CheckboxGroup>
  <output data-slot="output">{selected.length} of {people.length} selected</output>
</div>
