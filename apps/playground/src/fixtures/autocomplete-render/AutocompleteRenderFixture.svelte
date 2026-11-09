<script lang="ts">
  import {
    Autocomplete,
    AutocompleteContent,
    AutocompleteInput,
    AutocompleteItem,
    AutocompleteLabel,
    AutocompleteList,
    AutocompleteTrigger,
  } from "@ui-sdk/svelte"
  import { autocompleteFixture as f } from "tests/fixtures/autocomplete.ts"
</script>

<!-- Parts rendered as other elements, with render snippets and class names of state. -->
<div class="fixture">
  <button>Before</button>
  <Autocomplete name={f.name}>
    <AutocompleteLabel class="label">{f.label}</AutocompleteLabel>
    <AutocompleteInput>
      {#snippet render({ props, state })}
        <input
          {...props}
          class={["input", state.open ? "is-open" : "is-closed"]}
        />
      {/snippet}
    </AutocompleteInput>
    <AutocompleteTrigger aria-label={f.trigger}>▾</AutocompleteTrigger>
    <AutocompleteContent class="popup list-popup">
      <AutocompleteList>
        <AutocompleteItem class="item" value="docs" label="Docs" href="#docs">
          {#snippet render({ props })}
            <a {...props}>Docs</a>
          {/snippet}
        </AutocompleteItem>
        {#each f.items.slice(0, 3) as item (item.value)}
          <AutocompleteItem class="item" value={item.value} label={item.label}>
            {#snippet children(state)}
              {item.label}{state.highlighted ? " ←" : ""}
            {/snippet}
          </AutocompleteItem>
        {/each}
      </AutocompleteList>
    </AutocompleteContent>
  </Autocomplete>
  <button>After</button>
</div>
