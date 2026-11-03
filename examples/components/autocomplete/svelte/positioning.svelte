<script lang="ts">
  import {
    Autocomplete,
    AutocompleteArrow,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
  } from "@ui-sdk/svelte/autocomplete"

  const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry", "Blueberry"]

  let box: HTMLDivElement | undefined = $state()
</script>

<div bind:this={box} data-slot="card">
  <Autocomplete modal="pointer" container={box}>
    <AutocompleteLabel>Fruit</AutocompleteLabel>
    <AutocompleteInput />
    <AutocompleteContent
      side="top"
      align="end"
      sideOffset={10}
      alignOffset={-4}
      collisionPadding={8}
      anchor={box}
      keepMounted
    >
      <AutocompleteArrow />
      <AutocompleteList>
        {#each fruits as fruit (fruit)}
          <AutocompleteItem value={fruit}>
            {fruit}
          </AutocompleteItem>
        {/each}
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>
</div>
