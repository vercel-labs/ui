<script lang="ts">
  import { CheckIcon } from "@lucide/svelte"
  import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
  } from "@ui-sdk/svelte/combobox"

  const titles = ["Designer", "Engineer", "Engineering manager", "Product manager", "Researcher"]

  let value = $state<string | null>(null)
</script>

<div data-slot="stack">
  <Combobox bind:value allowCustomValue>
    <div data-slot="stack">
      <ComboboxLabel>Job title</ComboboxLabel>
      <ComboboxInput placeholder="Type any title" />
    </div>
    <ComboboxContent>
      <ComboboxEmpty>
        {#snippet children(state)}
          {#if state.empty}Press Enter to use “{state.query}”.{/if}
        {/snippet}
      </ComboboxEmpty>
      <ComboboxList>
        {#each titles as title (title)}
          <ComboboxItem value={title}>
            {title}
            <ComboboxItemIndicator>
              <CheckIcon aria-hidden="true" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        {/each}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
  <output data-slot="output">Value: {JSON.stringify(value)}</output>
</div>
