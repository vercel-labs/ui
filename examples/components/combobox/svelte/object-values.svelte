<script lang="ts">
  import { CheckIcon, ChevronDownIcon } from "@lucide/svelte"
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
  } from "@ui-sdk/svelte/combobox"

  const users = [
    { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
    { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
    { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
    { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
    { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
  ]

  let user: (typeof users)[number] | null = $state({ ...users[2] })
</script>

<div data-slot="stack">
  <Combobox
    bind:value={user}
    name="reviewer"
    itemToValue={(item: (typeof users)[number]) => String(item.id)}
    itemToLabel={(item: (typeof users)[number]) => item.name}
    isItemEqualToValue={(item: (typeof users)[number], value: (typeof users)[number]) => item.id === value.id}
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
        {#each users as item (item.id)}
          <ComboboxItem value={item} label={item.name}>
            {item.name}
            <ComboboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <output data-slot="output">Submits reviewer={user ? user.id : ""}</output>
</div>
