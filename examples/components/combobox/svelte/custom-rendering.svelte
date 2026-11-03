<script lang="ts">
  import { CheckIcon, SearchIcon } from "@lucide/svelte"
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
  } from "@ui-sdk/svelte/combobox"

  const users = [
    { id: 1, name: "Ada Lovelace", username: "ada", role: "Owner" },
    { id: 2, name: "Grace Hopper", username: "grace", role: "Admin" },
    { id: 3, name: "Alan Turing", username: "alan", role: "Member" },
    { id: 4, name: "Margaret Hamilton", username: "margaret", role: "Member" },
    { id: 5, name: "Edsger Dijkstra", username: "edsger", role: "Guest" },
  ]

</script>

<Combobox>
  <div data-slot="stack">
    <ComboboxLabel>Mention</ComboboxLabel>
    <ComboboxInput placeholder="@username">
      {#snippet render({ props })}
        <div data-slot="row">
          <SearchIcon />
          <input {...props} />
        </div>
      {/snippet}
    </ComboboxInput>
  </div>
  <ComboboxContent>
    <ComboboxEmpty>No one by that name.</ComboboxEmpty>
    <ComboboxList>
      {#each users as user (user.id)}
        <ComboboxItem value={user.username} label={user.name} keywords={[user.username]}>
          {#snippet render({ props, state })}
            <div {...props}>
              <span data-slot="badge">
                {user.name.slice(0, 1)}
              </span>
              <span data-slot="stack">
                {user.name}
                <span data-slot="hint">@{user.username}</span>
              </span>
              {#if state.selected}<CheckIcon />{/if}
            </div>
          {/snippet}
        </ComboboxItem>
      {/each}
    </ComboboxList>
  </ComboboxContent>
</Combobox>
