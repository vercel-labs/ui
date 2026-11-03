<script lang="ts">
  import { ArrowLeftIcon } from "@lucide/svelte"
  import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
  } from "@ui-sdk/svelte/autocomplete"

  const fruits = ["Apple", "Apricot", "Avocado", "Banana", "Blackberry"]
</script>

<Autocomplete required>
  <div data-slot="stack">
    <AutocompleteLabel>Fruit</AutocompleteLabel>
    <AutocompleteInput>
      {#snippet render({ props, state })}
        <input {...props} />
      {/snippet}
    </AutocompleteInput>
  </div>
  <AutocompleteContent>
    <AutocompleteList>
      <AutocompleteItem value="Fruit guide" href="#fruit-guide">
        {#snippet render({ props })}
          <a {...props}>
            Read the fruit guide
          </a>
        {/snippet}
      </AutocompleteItem>
      {#each fruits as fruit (fruit)}
        <AutocompleteItem value={fruit} label={fruit}>
          {#snippet render({ props, state })}
            <div {...props}>
              {fruit}{#if state.highlighted}<ArrowLeftIcon aria-hidden="true" />{/if}
            </div>
          {/snippet}
        </AutocompleteItem>
      {/each}
    </AutocompleteList>
  </AutocompleteContent>
</Autocomplete>
