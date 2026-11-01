<script lang="ts">
  import { Search, X } from "@lucide/svelte"
  import type { InputValueChangeReason } from "@ui-sdk/core/input"
  import { Input, InputClear, InputGroup } from "@ui-sdk/svelte/input"

  let query = $state("Lovelace")
  let reason = $state("")
</script>

<div data-slot="stack">
  <InputGroup>
    <Search aria-hidden="true" />
    <Input
      bind:value={query}
      type="search"
      aria-label="Search people"
      onValueChange={(_: string, details: { reason: InputValueChangeReason }) => (reason = details.reason)}
    />
    <InputClear aria-label="Clear search">
      <X aria-hidden="true" />
    </InputClear>
  </InputGroup>
  <p data-slot="hint">
    {reason ? `Last change: ${reason}` : "Type, or clear the search."}
  </p>
</div>
