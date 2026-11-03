<script lang="ts">
  import { Input } from "@ui-sdk/svelte/input"
</script>

<form data-slot="row" role="search" onsubmit={(event) => event.preventDefault()}>
  <Input type="search" name="q" aria-label="Search" placeholder="Search…" />
  <button type="submit">
    Search
  </button>
</form>
