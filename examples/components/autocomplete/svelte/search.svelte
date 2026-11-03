<script lang="ts">
  import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteList,
  } from "@ui-sdk/svelte/autocomplete"

  const recent = ["react hooks", "tailwind grid", "web components", "vue v-model"]

  let searched = $state("")
</script>

<form role="search" data-slot="stack" onsubmit={(event) => event.preventDefault()}>
  <Autocomplete submitOnSelect name="q" onSubmit={(value) => (searched = value)}>
    <AutocompleteInput type="search" aria-label="Search" placeholder="Search…" />
    <AutocompleteContent>
      <AutocompleteList>
        {#each recent as search (search)}
          <AutocompleteItem value={search}>
            {search}
          </AutocompleteItem>
        {/each}
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>
  <output data-slot="output">{searched ? `Searched “${searched}”` : "Press Enter to search"}</output>
</form>
